import * as k8s from '../src/k8s'
import {expect, test} from '@jest/globals'
import exp from 'constants'

test('trimRight', () => {
  expect(k8s.trimRight('/foo/bar/', '/')).toBe('/foo/bar')
  expect(k8s.trimRight('/foo/bar', '/')).toBe('/foo/bar')
  expect(k8s.trimRight('/foo/bar', 'r')).toBe('/foo/ba')
  expect(k8s.trimRight('/foo/bar', 'a')).toBe('/foo/bar')
})

test('ingressAnnotations()', () => {
  const bucketPath = 'foo/bar/baz'
  const bucketVhost = 'storage.googleapis.com'

  const annotations = k8s.ingressAnnotations(bucketPath, bucketVhost) || {}

  expect(Object.keys(annotations || {}).length).toBe(5)
  expect(annotations['nginx.ingress.kubernetes.io/upstream-vhost']).toBe(
    bucketVhost
  )
  Object.keys(annotations || {}).forEach(key => {
    expect(key.startsWith('nginx.ingress.kubernetes.io')).toBe(true)
  })
})

test('serviceForApp()', () => {
  const team = 'myteam'
  const app = 'myapp'
  const bucketVhost = 'storage.googleapis.com'

  const service = k8s.serviceForApp(team, app, bucketVhost)

  expect(service?.metadata?.name).toBe(app)
  expect(service?.metadata?.namespace).toBe(team)
  expect(service?.metadata?.labels?.app).toBe(app)
  expect(service?.metadata?.labels?.team).toBe(team)
  expect(service?.spec?.type).toBe('ExternalName')
  expect(service?.spec?.externalName).toBe(bucketVhost)
})

test('parsePath()', () => {
  expect(k8s.parsePath('')).toBe('/')
  expect(k8s.parsePath('/')).toBe('/')
  expect(k8s.parsePath('/foo')).toBe('/foo(/.*)?')
  expect(k8s.parsePath('/foo/')).toBe('/foo(/.*)?')
})

test('ingressForApp()', () => {
  const team = 'myteam'
  const app = 'myapp'
  const ingress = 'https://myapp.nav.no/foo/bar'
})
