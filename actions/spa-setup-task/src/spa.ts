import {writeFileSync} from 'fs'
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

const bucketVhost = 'storage.googleapis.com'

type NaisCluster = {
  naisCluster: string
  ingressClass: string
  cdnEnv: string
  cdnBucketPrefix: string
}

const hostMap: Clusters = {
  'nav.no': {
    naisCluster: 'prod-gcp',
    ingressClass: 'gw-nav-no',
    cdnEnv: CDNEnv.prod,
    cdnBucketPrefix: CDNBucketPrefix.prod
  },
  'intern.nav.no': {
    naisCluster: 'prod-gcp',
    ingressClass: 'gw-intern-nav-no',
    cdnEnv: CDNEnv.prod,
    cdnBucketPrefix: CDNBucketPrefix.prod
  },
  'labs.nais.io': {
    naisCluster: 'labs-gcp',
    ingressClass: 'gw-labs-nais-io',
    cdnEnv: CDNEnv.prod,
    cdnBucketPrefix: CDNBucketPrefix.prod
  },
  'dev.nav.no': {
    naisCluster: 'dev-gcp',
    ingressClass: 'gw-dev-nav-no',
    cdnEnv: CDNEnv.prod,
    cdnBucketPrefix: CDNBucketPrefix.prod
  },
  'dev.intern.nav.no': {
    naisCluster: 'dev-gcp',
    ingressClass: 'gw-dev-intern-nav-no',
    cdnEnv: CDNEnv.prod,
    cdnBucketPrefix: CDNBucketPrefix.prod
  }
}

export function splitFirst(s: string, sep: string): [string, string] {
  const [first, ...rest] = s.split(sep)
  return [first, rest.join(sep)]
}

export function domainForHost(host: string): string {
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
  return `${bucketPrefix}${team}/${team}/${app}/${env}`
}

export function naisResourcesForApp(
  team: string,
  app: string,
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
    ingressHost,
    ingressPath,
    ingressClass,
    bucketPath,
    bucketVhost
  )

  const serviceResource = serviceForApp(team, app, bucketVhost)

  const ingressFilePath = `${tmpDir}/${team}-${app}-ingress.yaml`
  const serviceFilePath = `${tmpDir}/${team}-${app}-service.yaml`

  writeFileSync(ingressFilePath, String(ingressResource))
  writeFileSync(serviceFilePath, String(serviceResource))

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
      `Invalid ingress: ${ingress}. Ingress must be a valid URL with a valid domain`
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
  cdnEnv: string
  cdnDest: string
  naisCluster: string
  naisResources: string
  naisVars: string
} {
  const {hostname: ingressHost, pathname: ingressPath} = new URL(ingress)

  const {naisCluster, ingressClass, cdnEnv, cdnBucketPrefix} =
    parseIngress(ingressHost)
  env = env || naisCluster
  const bucketPath = cdnPathForApp(team, app, env, cdnBucketPrefix)
  const naisResources = naisResourcesForApp(
    team,
    app,
    ingressHost,
    ingressPath,
    bucketPath,
    bucketVhost,
    ingressClass
  )
  const naisVars = ''
  return {
    cdnEnv,
    cdnDest: bucketPath,
    naisCluster,
    naisResources,
    naisVars
  }
}
