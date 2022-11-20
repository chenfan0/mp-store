import {
  reactive,
  enableTrack,
  disableTrack,
  weakMap,
  setActiveThis
} from './reactive'
import type {
  ActionsType,
  ObjKey,
  ObjType,
  OptionsType,
  ThisValueType,
  ValueType
} from './typing'

class MiniStore<StateT extends ObjType, ActionT extends ObjType> {
  private state: StateT
  private actions?: ActionsType<StateT, ActionT>
  private rawState: StateT
  constructor(value: ValueType<StateT, ActionT>) {
    this.rawState = value.state
    this.actions = value.actions
    this.state = reactive(value.state) as StateT
  }

  private saveEffectKeys(
    thisValue: ThisValueType,
    useKeys: (keyof StateT)[] = []
  ) {
    const effectKeysMap =
      thisValue.__effectKeysMap__ || new Map<ObjType, ObjKey[]>()
    effectKeysMap.set(this.rawState, useKeys)
    thisValue.__effectKeysMap__ = effectKeysMap
  }

  private saveCb(
    thisValue: ThisValueType,
    cb: (key: ObjKey, value: any) => any
  ) {
    const cbMap =
      thisValue.__cb__Map ||
      new Map<ObjType, (key: ObjKey, value: any) => any>()
    cbMap.set(this.rawState, cb)
    thisValue.__cb__Map = cbMap
  }

  useData(
    this: MiniStore<StateT, ActionT>,
    thisValue: ThisValueType,
    options: OptionsType<StateT> = {}
  ) {
    const { useKeys = [], total = false, immediate = true, cb } = options
    const keylen = useKeys?.length || 0
    if (!total && keylen === 0) return
    const _useKeys = total ? Object.keys(this.state) : useKeys
    // 将thisValue赋值给全局变量方便后续收集
    setActiveThis(thisValue)

    if (cb) {
      this.saveCb(thisValue, cb)
    }

    this.saveEffectKeys(thisValue, _useKeys)

    const useState: ObjType = {}

    for (const key of _useKeys) {
      const value = this.state[key]
      if (!cb && immediate) {
        useState[key] = value
      }
      if (cb && immediate) {
        cb(key, value)
      }
    }
    if (!cb && immediate) {
      thisValue.setData(useState)
    }
  }

  unUseData(this: MiniStore<StateT, ActionT>, thisValue: ThisValueType) {
    const effectMap = weakMap.get(this.rawState)
    if (!effectMap) return
    const keys = thisValue.__effectKeysMap__?.get(this.rawState) || []

    for (const key of keys) {
      const effectSet = effectMap.get(key)
      if (!effectSet) break
      effectSet.delete(thisValue)
      if (effectSet.size === 0) {
        effectMap.delete(key)
      }
    }
    if (effectMap.size === 0) {
      weakMap.delete(this.rawState)
    }
  }

  dispatch(actionKey: keyof ActionT, ...args: any[]) {
    if (!this.actions) return
    disableTrack()
    if (!this.actions[actionKey])
      throw new Error(`找不到${String(actionKey)}对应的action`)
    if (typeof this.actions[actionKey] !== 'function') {
      throw new Error(`${String(actionKey)}对应的value不是一个函数`)
    } else {
      this.actions[actionKey].call(null, this.state, ...args)
    }
    enableTrack()
  }
}

export default MiniStore
