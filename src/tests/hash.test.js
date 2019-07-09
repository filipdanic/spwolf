import { calculateHashOfValue, getHash } from '../hash'

describe('calculateHashOfValue', () => {
  it('should return simple types as String(value)', () => {
    expect(calculateHashOfValue(100)).toEqual('100')
    expect(calculateHashOfValue('200')).toEqual('200')
    expect(calculateHashOfValue(true)).toEqual('true')
    expect(calculateHashOfValue('foo')).toEqual('foo')
    expect(calculateHashOfValue(null)).toEqual('null')
    expect(calculateHashOfValue(undefined)).toEqual('undefined')
  })
  it('should return objects and arrays as JSON.stringify values', () => {
    expect(calculateHashOfValue({})).toEqual('{}')
    expect(calculateHashOfValue({ a: 1 })).toEqual(JSON.stringify({ a: 1 }))
    expect(calculateHashOfValue([1, 2, 3])).toEqual(JSON.stringify([1, 2, 3]))
  })
})

describe('getHash', () => {
  it(`
    should calculate hash of object by joining key and value with a "="
    char and separating with "||" at the end
    `, () => {
    expect(getHash({ a: 1, b: 2 })).toEqual('a=1||b=2||')
    expect(getHash({ a: 100, b: 'foo', c: '?name' })).toEqual('a=100||b=foo||c=?name||')
    expect(getHash({ a: { foo: 'bar' } })).toEqual(`a=${calculateHashOfValue({ foo: 'bar' })}||`)
  })
})
