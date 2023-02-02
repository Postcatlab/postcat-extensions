import { ApiData } from "./apiData";
import { Group } from "./group";

export type eoAPIType = {
  version: string
  environment: string
  group: Array<{ name: string; uuid: number }>
  project: { name: string }
  apiData: ApiData[]
}

export interface ImportProjectDto {
  name?: string
  description?: string
  version?: string
  environmentList: Environment[];
  collections: Collection[];
  projectUuid?: string;
  workSpaceUuid?: string;
}

export enum CollectionTypeEnum {
  GROUP = 0,
  API_DATA = 1
}


export type Collection = (ApiData | (Omit<Group, 'children'> & {children?: Collection[]})) & {
  /**
   * 0：group
   * 1: apiData
   */
  collectionType?: CollectionTypeEnum;
};

export type ValueOf<T> = T[keyof T]

 

export type EnvParameters = {
  name: string
  value: string
  description?: string
}

export type Environment = {
  /** 名称  */
  name: string
  /** 前置url  */
  hostUri: string
  /** 环境变量（可选）*/
  parameters?: EnvParameters[]
}
  

