import * as spa from '../src/spa'
import {expect, test} from '@jest/globals'

test('splitFirst()', () => {
  expect(spa.splitFirst('a.b.c', '.')).toEqual(['a', 'b.c'])
  expect(spa.splitFirst('a.b.c', 'b')).toEqual(['a.', '.c'])
})

test('isValidDomain()', () => {
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