import * as spa from '../src/spa'
import {expect, test, beforeAll, afterAll} from '@jest/globals'
import {existsSync, mkdirSync, rmSync} from 'fs'

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
  expect(spa.isValidIngress('h/tsdf.no')).toBe(false)
  expect(spa.isValidIngress('https://nav.no/')).toBe(false)
  expect(spa.isValidIngress('https://example.com/')).toBe(false)
  expect(spa.isValidIngress('https://www.nav.no/')).toBe(true)
  expect(spa.isValidIngress('https://www.nav.no/foobar')).toBe(true)
  expect(spa.isValidIngress('https://www.dev.nav.no/foobar')).toBe(true)
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
    'bucket-prefix-myteam/myteam/myapp/dev'
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
      'www.nav.no',
      '/myapp',
      'bucket/path',
      'storage.googleapis.com',
      'gw-foobar',
      tmpDir
    )
    .split(',')

  expect(resources).toHaveLength(2)
  expect(resources[0]).toContain('ingress.yaml')
  expect(resources[1]).toContain('service.yaml')
  resources.forEach(resource => {
    expect(existsSync(resource)).toBe(true)
  })
})
