import { useState, useEffect } from 'react'
import type { Item } from '../types'
import type { ItemOption } from './useGameState'

export const useItems = () => {
  const [options, setOptions] = useState<ItemOption[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('http://localhost:5000/api/items/select')
        const data: Item[] = await res.json()
        setOptions(
          data.map(item => ({
            value: item.id,
            label: `${item.name}`,
            rarity: item.rarity,
            type: item.type,
            manufacturer: item.manufacturer,
            game: item.game,
            element: item.elements,
            redText: item.redText,
            dlc: item.dlc,
            item,
          }))
        )
      } catch (err) {
        console.error('error fetching items', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchItems()
  }, [])

  return { options, isLoading }
}