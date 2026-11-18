import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref } from 'vue'
import { useMonthlyOrder } from './useMonthlyOrder.js'


beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useMonthlyOrder', () => {
  it('place les événements à venir avant ceux en cours', () => {
    const table = ref([
      { name: 'En cours', startDate: '2026-06-01T00:00:00Z', endDate: '2026-06-30T00:00:00Z' },
      { name: 'À venir',  startDate: '2026-06-20T00:00:00Z', endDate: '2026-07-10T00:00:00Z' },
    ])

    const ordered = useMonthlyOrder(table)

    expect(ordered.value.map((e) => e.name)).toEqual(['À venir', 'En cours'])
  })

  it('place les événements à venir avant ceux passés et ceux en cours', () => {
    const table = ref([
      { name: 'Passé',   startDate: '2026-05-01T00:00:00Z', endDate: '2026-05-31T00:00:00Z' },
      { name: 'En cours', startDate: '2026-06-01T00:00:00Z', endDate: '2026-06-30T00:00:00Z' },
      { name: 'À venir',  startDate: '2026-06-20T00:00:00Z', endDate: '2026-07-10T00:00:00Z' },
    ])  

    expect(useMonthlyOrder(table).value.map((e) => e.name)).toEqual(['À venir', 'Passé', 'En cours'])
  })

  it.todo('devrait placer les événements en cours en premier et ceux passé en dernier')

  it('si liste vide, renvoie une liste vide', () => {
    const table = ref([]) 

    expect(useMonthlyOrder(table).value).toEqual([])
  })  

  it('liste dorigine non modifiée', () => {
    const table = ref([
      { name: 'En cours', startDate: '2026-06-01T00:00:00Z', endDate: '2026-06-30T00:00:00Z' },
      { name: 'À venir',  startDate: '2026-06-20T00:00:00Z', endDate: '2026-07-10T00:00:00Z' },
    ])  

    expect(() => useMonthlyOrder(table).value).not.toThrow()
    expect(table.value.map((e) => e.name)).toEqual(['En cours', 'À venir'])
  })
  
  it('trier par startDate)', () => {
    const table = ref([
        { name: 'Plus lointain', startDate: '2026-06-20T00:00:00Z', endDate: '2026-07-10T00:00:00Z' },
        { name: 'Proche', startDate: '2026-06-18T00:00:00Z', endDate: '2026-06-30T00:00:00Z' },
    ])

    expect(useMonthlyOrder(table).value.map((e) => e.name)).toEqual(['Proche', 'Plus lointain'])
  })

  it('trier par endDate)', () => {
    const table = ref([
        { name: 'Plus lointain', startDate: '2026-06-04T00:00:00Z', endDate: '2026-07-10T00:00:00Z' },
        { name: 'Proche', startDate: '2026-06-01T00:00:00Z', endDate: '2026-06-30T00:00:00Z' },
    ])
    expect(useMonthlyOrder(table).value.map((e) => e.name)).toEqual(['Proche', 'Plus lointain'])
  })
})  


