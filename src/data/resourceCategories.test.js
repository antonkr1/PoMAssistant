import { describe, it, expect } from 'vitest'
import { resourceCategories } from './resourceCategories.js'

describe('resourceCategories', () => {
  it('est un tableau non vide', () => {
    expect(resourceCategories).toBeInstanceOf(Array)
    expect(resourceCategories.length).toBeGreaterThan(0)
  })

  it('chaque catégorie a un titre et des items', () => {
    resourceCategories.forEach((category) => {
      expect(category).toHaveProperty('title')
      expect(category).toHaveProperty('items')
      expect(Array.isArray(category.items)).toBe(true)
    })
  })

  it('chaque item a un id, src, alt et mode', () => {
    resourceCategories.forEach((category) => {
      category.items.forEach((item) => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('src')
        expect(item).toHaveProperty('alt')
        expect(item).toHaveProperty('mode')
      })
    })
  })

  it('chaque item a un id unique', () => {
    const ids = new Set()
    resourceCategories.forEach((category) => {
      category.items.forEach((item) => {
        expect(ids.has(item.id)).toBe(false)
        ids.add(item.id)
      })
    })
  })
})
