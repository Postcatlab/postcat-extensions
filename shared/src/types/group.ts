export interface Group {
    type?: number;
    name?: string;
    path?: string;
    depth?: number;
    parentId?: number;
    sort?: number;
    children?: Group[];
  }