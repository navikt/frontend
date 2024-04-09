import YAML from 'yaml'
import {mkdirSync, writeFileSync} from 'fs'
import {ingressesForApp, serviceForApp} from './k8s'

type Clusters = {
  [key: string]: NaisCluster
}

export type Ingress = {
  ingressHost: string
  ingressPath: string
  ingressClass: string
}

const defaultBucketVhost = 'cdn.nav.cloud.nais.io'

type NaisCluster = {
  naisCluster: string
  ingressClass: string
}

const hostMap: Clusters = {
  'nav.no': {
    naisCluster: 'prod-gcp',
    ingressClass: 'nais-ingress-external'
  },
  'intern.nav.no': {
    naisCluster: 'prod-gcp',
    ingressClass: 'nais-ingress'
  },
  'ansatt.nav.no': {
    naisCluster: 'prod-gcp',
    ingressClass: 'nais-ingress-fa'
  },
  'dev.nav.no': {
    naisCluster: 'dev-gcp',
    ingressClass: 'nais-ingress-external'
  },
  'dev.intern.nav.no': {
    naisCluster: 'dev-gcp',
    ingressClass: 'nais-ingress'
  },
  'intern.dev.nav.no': {
    naisCluster: 'dev-gcp',
    ingressClass: 'nais-ingress'
  },
  'ansatt.dev.nav.no': {
    naisCluster: 'dev-gcp',
    ingressClass: 'nais-ingress-fa'
  },
  'ekstern.dev.nav.no': {
    naisCluster: 'dev-gcp',
    ingressClass: 'nais-ingress-external'
  }
}

export function splitFirst(s: string, sep: string): [string, string] {
  const [first, ...rest] = s.split(sep)
  return [first, rest.join(sep)]
}

export function domainForHost(host: string): string {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, domain] = splitFirst(host, '.')

  return domain
}

export function isValidIngress(ingresses: string[]): boolean {
  for (const ingress of ingresses) {
    try {
      const url = new URL(ingress)
      if (parseIngress(url.host) === undefined) {
        return false
      }
    } catch (e) {
      return false
    }
  }

  return true
}

export function isValidAppName(app: string): boolean {
  // RFC 1123 https://tools.ietf.org/html/rfc1123#section-2
  return /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(app)
}

export function parseIngress(ingressHost: string): NaisCluster {
  return hostMap[domainForHost(ingressHost)]
}

export function cdnPathForApp(team: string, app: string, env: string): string {
  return `/${team}/${cdnDestForApp(app, env)}`
}

export function cdnDestForApp(app: string, env: string): string {
  return `${app}/${env}`
}

export function naisResourcesForApp(
  team: string,
  app: string,
  env: string,
  ingresses: Ingress[],
  bucketPath: string,
  bucketVhost: string,
  tmpDir = './tmp'
): string {
  const filePaths: string[] = []
  const serviceResource = serviceForApp(team, app, env, bucketVhost)
  const ingressesResource = ingressesForApp(
    team,
    app,
    env,
    ingresses,
    bucketPath,
    bucketVhost
  )

  mkdirSync(tmpDir, {recursive: true})

  for (const item of [serviceResource, ...ingressesResource.items]) {
    const name = item.metadata?.name || 'unknown'
    const type = item.kind?.toLowerCase() || 'unknown'
    const path = `${tmpDir}/${name}-${type}.yaml`

    filePaths.push(path)
    writeFileSync(path, YAML.stringify(item))
  }

  return filePaths.join(',')
}

export function validateInputs(
  team: string,
  app: string,
  ingress: string[],
  environment: string
): Error | null {
  if (!isValidAppName(team)) {
    return Error(
      `Invalid team name: ${team}. Team name must match regex: ^[a-z0-9]([-a-z0-9]*[a-z0-9])?$`
    )
  }

  if (!isValidAppName(app)) {
    return Error(
      `Invalid app name: ${app}. App name must match regex: ^[a-z0-9]([-a-z0-9]*[a-z0-9])?$`
    )
  }

  if (!isValidAppName(environment)) {
    return Error(
      `Invalid environment name: ${environment}. Environment name must match regex: ^[a-z0-9]([-a-z0-9]*[a-z0-9])?$`
    )
  }

  if (ingress.length === 0) {
    return Error('No ingress specified')
  }

  if (!isValidIngress(ingress)) {
    return Error(
      `Invalid ingress: ${ingress}. Ingress must be a valid URL with a known domain on format https://<host>/<path>`
    )
  }

  return null
}

export function spaSetupTask(
  team: string,
  app: string,
  urls: string[],
  env = ''
): {
  cdnDest: string
  naisCluster: string
  naisResources: string
} {
  let naisClusterFinal = ''

  const ingresses: Ingress[] = []

  for (const ingress of urls) {
    const {hostname: ingressHost, pathname: ingressPath} = new URL(ingress)
    const {naisCluster, ingressClass} = parseIngress(ingressHost)

    ingresses.push({ingressHost, ingressPath, ingressClass})

    naisClusterFinal = naisClusterFinal || naisCluster

    if (naisClusterFinal !== naisCluster) {
      throw Error(
        `Ingresses must be on same cluster. Found ${naisClusterFinal} and ${naisCluster}`
      )
    }
  }

  env = env || naisClusterFinal
  const bucketPath = cdnPathForApp(team, app, env)
  const cdnDest = cdnDestForApp(app, env)
  const naisResources = naisResourcesForApp(
    team,
    app,
    env,
    ingresses,
    bucketPath,
    defaultBucketVhost
  )

  return {
    cdnDest,
    naisCluster: naisClusterFinal,
    naisResources
  }
}
