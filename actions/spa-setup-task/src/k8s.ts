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
    'nginx.ingress.kubernetes.io/configuration-snippet': `rewrite ^(.*)/$ ${bucketPath}/index.html break;
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

export function ingressForApp(
  team: string,
  app: string,
  env: string,
  ingressHost: string,
  ingressPath: string,
  ingressClass: string,
  bucketPath: string,
  bucketVhost: string
): k8s.V1Ingress {
  const name = `${app}-${env}`
  const host = ingressHost
  const path = parsePath(ingressPath)
  const annotations = ingressAnnotations(bucketPath, bucketVhost)

  const ingressSpec: k8s.V1IngressSpec = {
    rules: [
      {
        host,
        http: {
          paths: [
            {
              path,
              pathType: 'ImplementationSpecific',
              backend: {
                service: {
                  name: app,
                  port: {
                    number: 80
                  }
                }
              }
            }
          ]
        }
      }
    ],
    ingressClassName: ingressClass
  }

  return {
    apiVersion: 'networking.k8s.io/v1',
    kind: 'Ingress',
    metadata: {
      name,
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
