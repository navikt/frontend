import {Ingress} from './spa'
import * as k8s from '@kubernetes/client-node'

const regexSuffix = '(/.*)?'

export function ingressAnnotations(
  bucketPath: string,
  bucketVhost: string
): k8s.V1ObjectMeta['annotations'] {
  return {
    'nginx.ingress.kubernetes.io/upstream-vhost': bucketVhost,
    'nginx.ingress.kubernetes.io/from-to-www-redirect': 'true',
    'nginx.ingress.kubernetes.io/use-regex': 'true',
    'nginx.ingress.kubernetes.io/server-snippet': `proxy_intercept_errors on;
error_page 404 = /index.html;`,
    'nginx.ingress.kubernetes.io/configuration-snippet': `more_set_headers "Cache-Control: public,max-age=0"
rewrite ^(.*)/$ ${bucketPath}/index.html break;
rewrite ^/(.*)$ ${bucketPath}/$1 break;`
  }
}

export function trimRight(s: string, char: string): string {
  return s.replace(new RegExp(`${char}+$`), '')
}

export function serviceForApp(
  team: string,
  app: string,
  env: string,
  bucketVhost: string
): k8s.V1Service {
  const name = `${app}-${env}`
  const serviceSpec: k8s.V1ServiceSpec = {
    type: 'ExternalName',
    externalName: bucketVhost,
    ports: [
      {
        name: 'http',
        port: 80,
        protocol: 'TCP',
        targetPort: 80
      }
    ]
  }

  return {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name,
      namespace: team,
      labels: {
        app,
        team,
        env
      }
    },
    spec: serviceSpec
  }
}

export function parsePath(path: string): string {
  // https://github.com/nais/naiserator/blob/342119c78c886e54f5c86c3aeffcce5b884bdccd/pkg/resourcecreator/ingress/ingress.go#L70
  return path.length > 1 ? `${trimRight(path, '/')}${regexSuffix}` : '/'
}

type IngressMap = {
  classes: {
    [key: string]: {
      hosts: IngressHosts
    }
  }
}

type IngressHosts = {
  [key: string]: {
    paths: string[]
  }
}

export function normalizeIngresses(ingresses: Ingress[]): IngressMap {
  const out: IngressMap = {classes: {}}

  for (const ingress of ingresses) {
    if (out.classes[ingress.ingressClass] === undefined) {
      out.classes[ingress.ingressClass] = {
        hosts: {}
      }
    }

    if (
      out.classes[ingress.ingressClass].hosts[ingress.ingressHost] === undefined
    ) {
      out.classes[ingress.ingressClass].hosts[ingress.ingressHost] = {
        paths: []
      }
    }

    out.classes[ingress.ingressClass].hosts[ingress.ingressHost].paths.push(
      ingress.ingressPath
    )
  }

  return out
}

export function ingressesForApp(
  team: string,
  app: string,
  env: string,
  ingresses: Ingress[],
  bucketPath: string,
  bucketVhost: string
): k8s.V1IngressList {
  const normalized = normalizeIngresses(ingresses)
  const ingressList: k8s.V1IngressList = {
    apiVersion: 'networking.k8s.io/v1',
    kind: 'IngressList',
    items: Object.keys(normalized.classes).map(ingressClass => {
      const ingressHosts = normalized.classes[ingressClass].hosts
      return ingressForApp(
        team,
        app,
        env,
        ingressHosts,
        ingressClass,
        bucketPath,
        bucketVhost
      )
    })
  }

  return ingressList
}

export function ingressForApp(
  team: string,
  app: string,
  env: string,
  ingressHosts: IngressHosts,
  ingressClass: string,
  bucketPath: string,
  bucketVhost: string
): k8s.V1Ingress {
  const serviceName = `${app}-${env}`
  const ingressName = `${app}-${env}-${ingressClass}`
  const annotations = ingressAnnotations(bucketPath, bucketVhost)

  const ingressSpec: k8s.V1IngressSpec = {
    ingressClassName: ingressClass,
    rules: Object.keys(ingressHosts).map(host => {
      return {
        host,
        http: {
          paths: ingressHosts[host].paths.map(ingressPath => {
            return {
              path: parsePath(ingressPath),
              pathType: 'ImplementationSpecific',
              backend: {
                service: {
                  name: serviceName,
                  port: {
                    number: 80
                  }
                }
              }
            }
          })
        }
      }
    })
  }

  return {
    apiVersion: 'networking.k8s.io/v1',
    kind: 'Ingress',
    metadata: {
      name: ingressName,
      namespace: team,
      labels: {
        app,
        team,
        env
      },
      annotations
    },
    spec: ingressSpec
  }
}
