import YAML from 'yaml'
import * as spa from '../src/spa'
import {expect, test, beforeAll, afterAll} from '@jest/globals'
import {existsSync, mkdirSync, readFileSync, rmSync} from 'fs'

const tmpDir = './tmp'

test('splitFirst()', () => {
  expect(spa.splitFirst('a.b.c', '.')).toEqual(['a', 'b.c'])
  expect(spa.splitFirst('a.b.c', 'b')).toEqual(['a.', '.c'])
})

test('domainForHost()', () => {
  expect(spa.domainForHost('a.b.c')).toBe('b.c')
  expect(spa.domainForHost('a.b.c.d')).toBe('b.c.d')
})

test('isValidIngress()', () => {
  const valids = [
    'https://www.nav.no/',
    'https://www.nav.no/foobar',
    'https://www.dev.nav.no/foobar'
  ]
  const invalids = ['h/tsdf.no', 'https://nav.no/', 'https://example.com/']

  for (const valid of valids) {
    for (const invalid of invalids) {
      expect(spa.isValidIngress([invalid])).toBe(false)
      expect(spa.isValidIngress([valid, invalid])).toBe(false)
      expect(spa.isValidIngress([invalid, valid])).toBe(false)
    }

    for (const valid2 of valids) {
      if (valid !== valid2) {
        expect(spa.isValidIngress([valid])).toBe(true)
        expect(spa.isValidIngress([valid, valid2])).toBe(true)
        expect(spa.isValidIngress([valid2, valid])).toBe(true)
      }
    }
  }
})

test('isValidAppName()', () => {
  expect(spa.isValidAppName('')).toBe(false)
  expect(spa.isValidAppName('a')).toBe(true)
  expect(spa.isValidAppName('a-')).toBe(false)
  expect(spa.isValidAppName('a-b')).toBe(true)
  expect(spa.isValidAppName('a-b-c')).toBe(true)
  expect(spa.isValidAppName('a-b-c-d')).toBe(true)
  expect(spa.isValidAppName('a-b-c-d-e')).toBe(true)
  expect(spa.isValidAppName('a-b-c-d-e-f')).toBe(true)
  expect(spa.isValidAppName('a-b-c-d-e-f-g')).toBe(true)
  expect(spa.isValidAppName('a-b-c-d-e-f-g-h')).toBe(true)
})

test('parseIngress()', () => {
  expect(spa.parseIngress('foo.nav.no').naisCluster).toEqual('prod-gcp')
  expect(spa.parseIngress('foo.dev.nav.no').naisCluster).toEqual('dev-gcp')
  expect(spa.parseIngress('example.com')).toBeUndefined()
})

test('cdnPathForApp()', () => {
  expect(spa.cdnPathForApp('myteam', 'myapp', 'dev', 'bucket-prefix-')).toBe(
    '/bucket-prefix-myteam/myteam/myapp/dev'
  )
})

afterAll(() => {
  rmSync(tmpDir, {recursive: true})
})

beforeAll(() => {
  try {
    rmSync(tmpDir, {recursive: true})
  } catch (e) {
    // ignore
  }
  mkdirSync(tmpDir)
})

test('naisResourcesForApp()', () => {
  const resources = spa
    .naisResourcesForApp(
      'myteam',
      'myapp',
      'myenv',
      [
        {
          ingressHost: 'www.nav.no',
          ingressPath: '/myapp',
          ingressClass: 'gw-foobar'
        }
      ],
      'bucket/path',
      'storage.googleapis.com',
      tmpDir
    )
    .split(',')

  expect(resources).toHaveLength(2)
  const [ingress, service] = resources

  expect(ingress).toContain('ingress.yaml')
  expect(service).toContain('service.yaml')

  const ingressYaml = YAML.parse(readFileSync(ingress, 'utf-8'))
  const serviceYaml = YAML.parse(readFileSync(service, 'utf-8'))

  expect(ingressYaml.kind).toEqual('IngressList')
  expect(serviceYaml.kind).toEqual('Service')

  expect(ingressYaml.items.length).toEqual(1)
  expect(ingressYaml.items[0].metadata.name).toEqual('myapp-myenv-gw-foobar')
  expect(ingressYaml.items[0].spec.rules.length).toEqual(1)
  expect(ingressYaml.items[0].spec.rules[0].host).toEqual('www.nav.no')
  expect(
    ingressYaml.items[0].spec.rules[0].http.paths[0].backend.service.name
  ).toEqual(serviceYaml.metadata.name)
})
