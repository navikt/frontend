import * as k8s from '@kubernetes/client-node'

type Clusters = {
  [key: string]: NaisCluster
};

type NaisCluster = {
  naisCluster: string;
  ingressClass: string;
  cdnEnv: string;
}

const hostMap: Clusters = {
  'nav.no': {
    'naisCluster': 'prod-gcp',
    'ingressClass': 'gw-nav-no',
    'cdnEnv': 'cdn.nav.no',
  },
  'intern.nav.no': {
    'naisCluster': 'prod-gcp',
    'ingressClass': 'gw-intern-nav-no',
    'cdnEnv': 'cdn.nav.no',
  },
  'labs.nais.io': {
    'naisCluster': 'labs-gcp',
    'ingressClass': 'gw-labs-nais-io',
    'cdnEnv': 'cdn.nav.no',
  },
  'dev.nav.no': {
    'naisCluster': 'dev-gcp',
    'ingressClass': 'gw-dev-nav-no',
    'cdnEnv': 'cdn.nav.no',
  },
  'dev.intern.nav.no': {
    'naisCluster': 'dev-gcp',
    'ingressClass': 'gw-dev-intern-nav-no',
    'cdnEnv': 'cdn.nav.no',
  },
}

export function splitFirst(s: string, sep: string): [string, string] {
  const [first, ...rest] = s.split(sep)
  return [first, rest.join(sep)]
}

export function domainForIngress(ingress: string): string {
  try {
    const url = new URL(ingress)
    const [_, domain] = splitFirst(url.hostname, '.')

    return domain
  } catch (e) {
    return ''
  }
}

export function isValidIngress(ingress: string): boolean {
  return domainForIngress(ingress) in hostMap
}

export function isValidAppName(app: string): boolean {
  // RFC 1123 https://tools.ietf.org/html/rfc1123#section-2
  return /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(app)
}

export function parseIngress(ingress: string): NaisCluster {
  return hostMap[domainForIngress(ingress)]
}

export function cdnDestFromTeamApp(team: string, app: string): string {
  return `${app}`
}

export function naisResourcesForApp(team: string, app: string, ingress: string, ingressClass: string): string {
  const ingressResource = new k8s.V1Ingress()
  ingressResource.metadata = new k8s.V1ObjectMeta()
  ingressResource.metadata.name = app
  ingressResource.metadata.namespace = team
  ingressResource.metadata.labels = {
    'app': app,
    'team': team,
  }
  ingressResource.spec = new k8s.V1IngressSpec()
  ingressResource.spec.ingressClassName = ingressClass
  ingressResource.spec.rules = [
    {
      host: ingress,
      http: {
        paths: [
          {
            path: '/',
            pathType: 'Prefix',
            backend: {
              service: {
                name: app,
                port: {
                  number: 80,
                },
              },
            },
          },
        ],
      },
    },
  ]

  return 'foo'
}

export function naisVarsForApp(team: string, app: string, ingress: string, ingressClass: string): string {
  return ''
}

export function validateInputs(team: string, app: string, ingress: string): Error | null {
  if (!isValidAppName(app)) {
    return Error(`Invalid app name: ${app}. App name must match regex: ^[a-z0-9]([-a-z0-9]*[a-z0-9])?$`)
  }

  if (!isValidIngress(ingress)) {
    return Error(`Invalid ingress: ${ingress}. Ingess must be a valid URL with a valid domain`)
  }

  return null
}

export function spaSetupTask(team: string, app: string, ingress: string): { cdnEnv: string, cdnDest: string, naisCluster: string, ingressClass: string, naisResources: string, naisVars: string } {
  const { naisCluster, ingressClass, cdnEnv } = parseIngress(ingress)
  const cdnDest = cdnDestFromTeamApp(team, app)
  const naisResources = naisResourcesForApp(team, app, ingress, ingressClass)
  const naisVars = naisVarsForApp(team, app, ingress, ingressClass)
  return { cdnEnv, cdnDest, naisCluster, ingressClass, naisResources, naisVars }
}