import type { ColVal, Item } from '@mim-workspace/types';

export type AllInventoryKeys =
  | 'priority'
  | 'attachments'
  | 'form_notes'
  | 'new_origin'
  | 'used_origin'
  | 'wholesale_transaction_method'
  | 'auction_transaction_method'
  | 'title_or_payoff'
  | 'title_status'
  | 'payoff_amount'
  | 'good_till_date'
  | 'lien_holder'
  | 'per_diam'
  | 'payment_tracking'
  | 'check_status'
  | 'inventory_notes'
  | 'status'
  | 'store_name'
  | 'created_date'
  | 'start_date'
  | 'end_date'
  | 'submit_by'
  | 'return_email'
  | 'submission_link'
  | 'car_type'
  | 'assigned_person'
  | 'assigned_controller'
  | 'vendor_created'
  | 'reversal'
  | 'subtasks'
  | 'unknown'
  | 'assigned_printer'
  | 'inventory_clerk';

export interface InventoryItem extends Record<
  AllInventoryKeys,
  ColVal | undefined
> {}

export class InventoryItem {
  public uid: string;
  public stock_number: string;

  constructor(item: Item, columnMap: Record<string, string>) {
    this.uid = String(item.id);
    this.stock_number = String(item.name);

    for (const key in columnMap) {
      if (
        key === 'uid' ||
        key === 'stock_number' ||
        key === 'UID' ||
        key === 'STOCK_NUMBER'
      ) {
        continue;
      }

      const columnId = columnMap[key];
      const value = item.column_values.find((val) => val.id === columnId);

      if (!value) {
        console.warn(
          `Column ${columnId} (${key}) not found for item ${item.id}`,
          item.column_values
        );
      } else {
        (this as any)[key] = value;
      }
    }
  }
}
