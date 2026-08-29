import { describe, it, expect } from 'vitest'
import { actionForKey } from './keymap'

describe('actionForKey', () => {
  it.each([
    ['ArrowLeft', 'left'],
    ['ArrowRight', 'right'],
    ['ArrowUp', 'thrust'],
    [' ', 'fire'],
    ['Control', 'hyperspace']
  ] as const)('maps %s to %s', (key, action) => {
    expect(actionForKey(key)).toBe(action)
  })

  it('returns null for keys with no game action', () => {
    expect(actionForKey('ArrowDown')).toBeNull()
    expect(actionForKey('a')).toBeNull()
    expect(actionForKey('Shift')).toBeNull()
    expect(actionForKey('')).toBeNull()
  })
})
