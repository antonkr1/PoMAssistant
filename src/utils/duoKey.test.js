import { describe, it, expect } from 'vitest'
import { getDuoKey } from './duoKey.js'

describe('getDuoKey', () => {
  it('assemble nom, numéro de pokémon et numéro de dex', () => {
    const pair = { trainerName: 'Red', pokemonNumber: 1, dexNumber: 2 }
    expect(getDuoKey(pair)).toBe('Red-1-2')
  })

  it('deux clés différentes pour deux paires différentes', () => {
    const pair1 = { trainerName: 'Red', pokemonNumber: 1, dexNumber: 2 }
    const pair2 = { trainerName: 'Blue', pokemonNumber: 3, dexNumber: 4 }
    expect(getDuoKey(pair1)).not.toBe(getDuoKey(pair2))
  })

  it('toujours la même clé pour la même paire', () => {
    const pair = { trainerName: 'Red', pokemonNumber: 1, dexNumber: 2 }
    expect(getDuoKey(pair)).toBe(getDuoKey(pair))
  })

  it('test avec valeur invalide', () => {
    const pair = { trainerName: 'Red', pokemonNumber: 'test', dexNumber: 2 }
    expect(getDuoKey(pair)).toBe('Red-test-2')
})
  it.todo('devrait refuser un numéro de pokémon non numérique')
})
