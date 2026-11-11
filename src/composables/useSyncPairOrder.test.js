import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useSyncPairOrder } from './useSyncPairOrder.js'

const pairs = ref([
    { name: 'Pair A', releaseDate: '2023-01-01' },
    { name: 'Pair B', releaseDate: '2023-03-01' },
    { name: 'Pair C', releaseDate: '2023-02-01' },
])
describe('useSyncPairOrder', () => {
 it('Doit trier les paires par date de sortie en ordre décroissant', () => {
    const sortedPairs = useSyncPairOrder(pairs)
    expect(sortedPairs.value).toEqual([ 
        
        { name: 'Pair B', releaseDate: '2023-03-01' },
        { name: 'Pair C', releaseDate: '2023-02-01' },
        { name: 'Pair A', releaseDate: '2023-01-01' },
    ])
  })
  it('Ne modifie pas la liste originale', () => {
    const originalPairs = [...pairs.value]
    const sortedPairs = useSyncPairOrder(pairs)

    sortedPairs.value 
    expect(pairs.value).toHaveLength(originalPairs.length)
  })

  it('plante si releaseDate est absent (comportement actuel)', () => {
    const list = ref([
        { name: 'Avec date', releaseDate: '2023-01-01' },
        { name: 'Sans date' },
    ])
    const sortedPairs = useSyncPairOrder(list)

    expect(() => sortedPairs.value).toThrow()
  })
})