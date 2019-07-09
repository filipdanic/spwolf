import diff from '../diff'

describe('diff', () => {
  it('should return the diff object specified by contract', () => {
    const val = diff(undefined, {})
    expect(val.hasOwnProperty('diff')).toEqual(true)
    expect(val.hasOwnProperty('detailedDiff')).toEqual(true)
    expect(val.detailedDiff.hasOwnProperty('added')).toEqual(true)
    expect(val.detailedDiff.hasOwnProperty('updated')).toEqual(true)
    expect(val.detailedDiff.hasOwnProperty('deleted')).toEqual(true)
  })
})
