import { describe, it, expect, afterEach, vi } from 'vitest'
import { useMonthly } from './useMonthly.js'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('useMonthly', () => {
  it('charge les événements et les bannières', async () => {
    const fakeData = { EVENTS: [{ name: 'E1' }], BANNERS: [{ name: 'B1' }] }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => fakeData }))

    const { events, banners, loadMonthlyData } = useMonthly()
    await loadMonthlyData()

    expect(events.value).toEqual(fakeData.EVENTS)
    expect(banners.value).toEqual(fakeData.BANNERS)
  })
  it('pas de second téléchargement si les données sont déjà chargées', async () => {
    const fakeData = { EVENTS: [{ name: 'E1' }], BANNERS: [{ name: 'B1' }] }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => fakeData })) 
    
    expect(fetch).toHaveBeenCalledTimes(0)
    const { loadMonthlyData } = useMonthly()
    await loadMonthlyData()
    expect(fetch).toHaveBeenCalledTimes(1)
    await loadMonthlyData()
    expect(fetch).toHaveBeenCalledTimes(1)
  })
  it('erreur ne casse pas le chargement des données', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Erreur de téléchargement')))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { events, banners, loadMonthlyData } = useMonthly()
    await loadMonthlyData()

    expect(events.value).toEqual([])
    expect(banners.value).toEqual([])
    expect(console.error).toHaveBeenCalled()
  })
})
