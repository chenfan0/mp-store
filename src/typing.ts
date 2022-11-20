export type ObjKey = string | number | symbol
export type ObjType = Record<ObjKey, any>

export interface ThisValueType {
  setData: (...args: any[]) => any
  __cb__Map?: Map<ObjType, (key: ObjKey, value: any) => any>
  __effectKeysMap__?: Map<ObjType, ObjKey[]>
  [key: string]: any
}

export type ActionsType<StateT, ActionT> = {
  [key in keyof ActionT]: (state: StateT, ...args: any[]) => any
}

export interface ValueType<StateT, ActionT> {
  state: StateT
  actions?: ActionsType<StateT, ActionT>
}

export interface OptionsType<StateT> {
  useKeys?: (keyof StateT)[]
  cb?: (key: ObjKey, value: any) => any
  immediate?: boolean
  total?: boolean
}
