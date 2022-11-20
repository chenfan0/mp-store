import type { ObjKey, ObjType, ThisValueType } from './typing'

function isObj(value: unknown) {
  return typeof value === 'object' && value !== null
}

export const weakMap = new WeakMap<ObjType, Map<ObjKey, Set<ThisValueType>>>()

let activeThis: ThisValueType
let showTrack = true

export function disableTrack() {
  showTrack = false
}

export function enableTrack() {
  showTrack = true
}

export function setActiveThis(thisValue: ThisValueType) {
  activeThis = thisValue
}

function track(target: ObjType, key: ObjKey) {
  if (!activeThis || !showTrack) return
  let targetMap = weakMap.get(target)
  if (!targetMap) {
    targetMap = new Map()
    weakMap.set(target, targetMap)
  }
  let keyMap = targetMap.get(key)
  if (!keyMap) {
    keyMap = new Set()
    targetMap.set(key, keyMap)
  }

  keyMap.add(activeThis)
}

function trigger(target: ObjType, key: ObjKey, newValue: unknown) {
  const targetMap = weakMap.get(target)
  if (!targetMap) return
  const keyMap = targetMap.get(key)
  if (!keyMap) return
  keyMap.forEach((effect) => {
    if (effect.__cb__Map) {
      const cb = effect.__cb__Map.get(target)
      cb && cb(key, newValue)
    } else {
      effect.setData({
        [key]: newValue
      })
    }
  })
}

export function reactive(value: ObjType) {
  if (!isObj(value)) throw new Error('state must be a Object!!!')
  return new Proxy(value, {
    get(target, key, receier) {
      track(target, key)
      return Reflect.get(target, key, receier)
    },
    set(target, key, newValue, receiver) {
      const res = Reflect.set(target, key, newValue, receiver)
      trigger(target, key, newValue)
      return res
    }
  })
}
