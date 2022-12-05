import YAML from 'yaml'
import {mkdirSync, writeFileSync} from 'fs'
import {ingressForApp, serviceForApp} from './k8s'

enum CDNEnv {
  prod = 'cdn.nav.no',
  dev = 'cdn.dev.nav.no'
}

enum CDNBucketPrefix {
  prod = 'frontend-plattform-prod-',
  dev = 'frontend-plattform-dev-'
}

type Clusters = {
  [key: string]: NaisCluster
}

const defaultBucketVhost = 'storage.googleapis.com'

type NaisCluster = {
  naisCluster: string
  ingressClass: string
  cdnHost: string
  cdnBucketPrefix: string
}

const hostMap: Clusters = {
  'nav.no': {
    naisCluster: 'prod-gcp',
    ingressClass: 'gw-nav-no',
    cdnHost: CDNEnv.prod,
    cdnBucketPrefix: CDNBucketPrefix.prod
  },
  'intern.nav.no': {
    naisCluster: 'prod-gcp',
    ingressClass: 'gw-intern-nav-no',
    cdnHost: CDNEnv.prod,
    cdnBucketPrefix: CDNBucketPrefix.prod
  },
  'labs.nais.io': {
    naisCluster: 'labs-gcp',
    ingressClass: 'gw-labs-nais-io',
    cdnHost: CDNEnv.prod,
    cdnBucketPrefix: CDNBucketPrefix.prod
  },
  'dev.nav.no': {
    naisCluster: 'dev-gcp',
    ingressClass: 'gw-dev-nav-no',
    cdnHost: CDNEnv.prod,
    cdnBucketPrefix: CDNBucketPrefix.prod
  },
  'dev.intern.nav.no': {
    naisCluster: 'dev-gcp',
    ingressClass: 'gw-dev-intern-nav-no',
    cdnHost: CDNEnv.prod,
    cdnBucketPrefix: CDNBucketPrefix.prod
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

export function isValidIngress(ingress: string): boolean {
  // check if the url is valid

  try {
    const url = new URL(ingress)
    return parseIngress(url.host) !== undefined
  } catch (e) {
    return false
  }
}

export function isValidAppName(app: string): boolean {
  // RFC 1123 https://tools.ietf.org/html/rfc1123#section-2
  return /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(app)
}

export function parseIngress(ingressHost: string): NaisCluster {
  return hostMap[domainForHost(ingressHost)]
}

export function cdnPathForApp(
  team: string,
  app: string,
  env: string,
  bucketPrefix: string
): string {
  return `${bucketPrefix}${team}/${team}/${cdnDestForApp(app, env)}`
}

export function cdnDestForApp(app: string, env: string): string {
  return `${app}/${env}`
}

export function naisResourcesForApp(
  team: string,
  app: string,
  env: string,
  ingressHost: string,
  ingressPath: string,
  bucketPath: string,
  bucketVhost: string,
  ingressClass: string,
  tmpDir = './tmp'
): string {
  const ingressResource = ingressForApp(
    team,
    app,
    env,
    ingressHost,
    ingressPath,
    ingressClass,
    bucketPath,
    bucketVhost
  )

  const serviceResource = serviceForApp(team, app, env, bucketVhost)

  const ingressFilePath = `${tmpDir}/${team}-${app}-${env}-ingress.yaml`
  const serviceFilePath = `${tmpDir}/${team}-${app}-${env}-service.yaml`

  mkdirSync(tmpDir, {recursive: true})
  writeFileSync(ingressFilePath, YAML.stringify(ingressResource))
  writeFileSync(serviceFilePath, YAML.stringify(serviceResource))

  return [ingressFilePath, serviceFilePath].join(',')
}

export function validateInputs(
  team: string,
  app: string,
  ingress: string
): Error | null {
  if (!isValidAppName(app)) {
    return Error(
      `Invalid app name: ${app}. App name must match regex: ^[a-z0-9]([-a-z0-9]*[a-z0-9])?$`
    )
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
  ingress: string,
  env = ''
): {
  cdnHost: string
  cdnDest: string
  naisCluster: string
  naisResources: string
} {
  const {hostname: ingressHost, pathname: ingressPath} = new URL(ingress)

  const {naisCluster, ingressClass, cdnHost, cdnBucketPrefix} =
    parseIngress(ingressHost)
  env = env || naisCluster
  const bucketPath = cdnPathForApp(team, app, env, cdnBucketPrefix)
  const cdnDest = cdnDestForApp(app, env)
  const naisResources = naisResourcesForApp(
    team,
    app,
    env,
    ingressHost,
    ingressPath,
    bucketPath,
    defaultBucketVhost,
    ingressClass
  )
  return {
    cdnHost,
    cdnDest,
    naisCluster,
    naisResources
  }
}
