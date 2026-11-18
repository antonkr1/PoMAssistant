import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useSyncPairFilters } from './useSyncPairFilters.js'

const pairs = ref([
  { pokemonType: 'Fire',  syncPairRole: 'Strike (Physical)', syncPairRarity: '5', tags: [] },
  { pokemonType: 'Water', syncPairRole: 'Tech',    syncPairRarity: '4', tags: ['Weather'] },
  { pokemonType: 'Grass', syncPairRole: 'Strike (Special)', syncPairRarity: '3', tags: ['Terrain'] },
  { pokemonType: 'Electric', syncPairRole: 'Field', syncPairRarity: '5', tags: ['Wish Zone'] },
  { pokemonType: 'Ice', syncPairRole: 'Sprint', syncPairRarity: '4', tags: ['Region Circle'] },
  { pokemonType: 'Fighting', syncPairRole: 'Multi', syncPairRarity: '3', tags: ['Rebuff'] },
])

describe('useSyncPairFilters', () => {

  it("toggleRole('striker') garde les rôles Strike (Special) et Strike (Physical)", () => {
    const { filteredPairs, toggleRole } = useSyncPairFilters(pairs)

    toggleRole('striker')

    expect(filteredPairs.value).toHaveLength(2)
    expect(filteredPairs.value.map((pair) => pair.syncPairRole)).toEqual([
      'Strike (Physical)',
      'Strike (Special)',
    ])
  })
  
  it('sans filtre, renvoie toutes les paires', () => {
    const { filteredPairs } = useSyncPairFilters(pairs)
    expect(filteredPairs.value).toHaveLength(pairs.value.length)
  })

  it('toggleType garde seulement le type choisi', () => {
    const { filteredPairs, toggleType } = useSyncPairFilters(pairs)

    toggleType('Fire')

    expect(filteredPairs.value).toHaveLength(1)
    expect(filteredPairs.value[0].pokemonType).toBe('Fire')
  })

  it("toggleTag('terrain') garde les paires avec Terrain, Weather ou Wish Zone", () => {
    const { filteredPairs, toggleTag } = useSyncPairFilters(pairs)

    toggleTag('terrain')

    expect(filteredPairs.value).toHaveLength(3)
    expect(filteredPairs.value.map((pair) => pair.pokemonType)).toEqual(['Water', 'Grass', 'Electric'])
  })

  it('toggleType une deuxieme fois désactive le filtre', () => {
    const { filteredPairs, toggleType } = useSyncPairFilters(pairs)
    
    toggleType('Fire')
    toggleType('Fire')
    expect(filteredPairs.value).toHaveLength(pairs.value.length)
  })

  it('toggleRarity garde seulement la rareté choisie', () => {
    const { filteredPairs, toggleRarity } = useSyncPairFilters(pairs)

    toggleRarity('5')

    expect(filteredPairs.value).toHaveLength(2)
    expect(filteredPairs.value.map((pair) => pair.syncPairRarity)).toEqual(['5', '5'])
  })
})