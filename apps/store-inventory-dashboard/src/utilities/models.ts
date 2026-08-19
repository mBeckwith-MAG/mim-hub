import type { ColVal, Item } from './types'
import { Columns } from './constants'

type AllColumnKeys = keyof typeof Columns
type DynamicColumnKeys = Exclude<AllColumnKeys, 'STOCK_NUMBER' | 'UID'>

export interface InventoryItem extends Record<DynamicColumnKeys, ColVal> {}

export class InventoryItem {
  public uid: string
  public stock_number: string

  constructor(item: Item) {
    this.uid = String(item.id)
    this.stock_number = String(item.name)

    for (const key in Columns) {
      if (key === 'UID' || key === 'STOCK_NUMBER') {
        continue
      }

      const lookupKey = key as AllColumnKeys
      const value: ColVal | undefined = item.column_values.find(
        (val) => val.id === Columns[lookupKey],
      )

      if (!value) {
        console.warn(
          `Column ${Columns[lookupKey]} not found for item ${item.id}`,
          item.column_values,
        )
      } else {
        ;(this as any)[key] = value
      }
    }
  }
}
