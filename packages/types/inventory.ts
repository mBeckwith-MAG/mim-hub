import type { InventoryItem } from '../models';

export interface ColVal {
  id: string;
  text: string | null;
  value: string | null;
}

export interface Item {
  id: string;
  name: string;
  column_values: Array<ColVal>;
}

export interface BoardItem {
  id: string;
  name: string;
  board: Board;
  column_values: Array<ColVal>;
}

export interface RawFile {
  id: string;
  file: File;
  preview: string;
}

export type RawFiles = {
  files: Array<FileData>;
};

export type FileData = {
  name: string;
  assetId: number;
  isImage: boolean;
  fileType: string;
};

export type Attachment = {
  url: string;
  name: string;
};

export interface ColorKeyGuide {
  color: string;
  label: string;
}

export type FilterDropdown = {
  name: string;
  label: string;
  options: Array<string>;
};

export type Board = {
  id: string;
  name: string;
};

export type PopupData = {
  title: string;
  description: string;
  item: InventoryItem;
};

export type ConfirmStatus = {
  status: string;
  notes: string;
  item: InventoryItem;
};

export interface ItemsPageResponse {
  data: {
    data: {
      boards: {
        items_page: {
          items: BoardItem[];
        };
      }[];
    };
  };
}

export interface ColumnValues {
  id: string;
  text: string | null;
  value: string | null;
}

export interface ItemPageResponse {
  data: {
    data: {
      items: {
        id: string;
        name: string;
        board: {
          id: string;
          name: string;
        };
        column_values: ColumnValues[];
      }[];
    };
  };
}
