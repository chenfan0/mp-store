import { expect, test, vi } from "vitest";
import MiniStore from '../src/index'
import { ThisValueType } from "../src/typing";

const getThisValue = (data?, setData?) => ({
  setData: setData || function(value) {
      this.data = {
        ...this.data,
        ...value
      }
  },
  data: data || {
    origin: 'xxx'
  }
})

test("使用 useKeys 应该将数据添加到data上", () => {
  // thisValue模拟小程序页面中的this
  const thisValue: ThisValueType = getThisValue({})
  const userStore = new MiniStore({
    state: {
      name: 'userStore',
      age: 18,
      id: '001'
    }
  })
  userStore.useData(thisValue, { useKeys: ['name', 'age'] })
  expect(thisValue.data).toEqual({
    name: 'userStore',
    age: 18
  })
})

test("使用 useKeys 应该将数据添加到data上，并且不影响原先data值", () => {
  const thisValue: ThisValueType = getThisValue()
  const userStore = new MiniStore({
    state: {
      name: 'userStore',
      age: 18,
      id: '001'
    }
  })
  userStore.useData(thisValue, { useKeys: ['name', 'age'] })
  expect(thisValue.data).toEqual({
    name: 'userStore',
    age: 18,
    origin: 'xxx'
  })
})

test("使用 total 应该将所有数据添加到data上，并且不影响原先data值", () => {
  const thisValue: ThisValueType = getThisValue()
  const userStore = new MiniStore({
    state: {
      name: 'userStore',
      age: 18,
      id: '001'
    }
  })
  userStore.useData(thisValue, { total: true })
  expect(thisValue.data).toEqual({
    name: 'userStore',
    age: 18,
    id: '001',
    origin: 'xxx'
  })
})

test("total优先级应该比useKeys高", () => {
  const thisValue: ThisValueType = getThisValue()
  const userStore = new MiniStore({
    state: {
      name: 'userStore',
      age: 18,
      id: '001'
    }
  })
  userStore.useData(thisValue, { total: true, useKeys: ['age'] })
  expect(thisValue.data).toEqual({
    name: 'userStore',
    age: 18,
    id: '001',
    origin: 'xxx'
  })
})

test("immediate为true且没有传入cb时, setData一开始会被调用1次", () => {
  const market = {
    setData(value) {
      this.data = {
        ...this.data,
        ...value
      }
    }
  }
  const setDataSpy = vi.spyOn(market, 'setData')
  const thisValue: ThisValueType = getThisValue({}, setDataSpy)
  const userStore = new MiniStore({
    state: {
      name: 'userStore',
      age: 18,
      id: '001'
    }
  })
  userStore.useData(thisValue, { total: true, immediate: true })
  expect(setDataSpy).toHaveBeenCalledTimes(1)
})

test("immediate为false时且没有传入cb时, setData一开始不会被调用", () => {
  const market = {
    setData(value) {
      this.data = {
        ...this.data,
        ...value
      }
    }
  }
  const setDataSpy = vi.spyOn(market, 'setData')
  const thisValue: ThisValueType = getThisValue({}, setDataSpy)
  const userStore = new MiniStore({
    state: {
      name: 'userStore',
      age: 18,
      id: '001'
    }
  })
  userStore.useData(thisValue, { total: true, immediate: false })
  expect(setDataSpy).toHaveBeenCalledTimes(0)
})

test("传入cb函数时，会执行cb函数，不会执行setData", () => {
  const market = {
    setData(value) {
      this.data = {
        ...this.data,
        ...value
      }
    },
    cb: (key, value) => {
      console.log(key, value);
      
    }
  }
  const setDataSpy = vi.spyOn(market, 'setData')
  const cbSpy = vi.spyOn(market, 'cb')
  const thisValue: ThisValueType = getThisValue({}, setDataSpy)
  const userStore = new MiniStore({
    state: {
      name: 'userStore',
      age: 18,
      id: '001'
    }
  })
  userStore.useData(thisValue, { useKeys: ['age'], cb: cbSpy as any })
  expect(setDataSpy).toHaveBeenCalledTimes(0)
  expect(cbSpy).toHaveBeenCalledTimes(1)
})

test("传入cb时，使用了store中的几个数据，就会执行几次cb函数", () => {
  const market = {
    setData(value) {
      this.data = {
        ...this.data,
        ...value
      }
    },
    cb: (key, value) => {
      console.log(key, value);
      
    }
  }
  const setDataSpy = vi.spyOn(market, 'setData')
  const cbSpy = vi.spyOn(market, 'cb')
  const thisValue: ThisValueType = getThisValue({}, setDataSpy)
  const userStore = new MiniStore({
    state: {
      name: 'userStore',
      age: 18,
      id: '001'
    }
  })
  userStore.useData(thisValue, { total: true, cb: cbSpy as any })
  expect(setDataSpy).toHaveBeenCalledTimes(0)
  expect(cbSpy).toHaveBeenCalledTimes(3)
})

test("immediate为false时，不会执行cb函数", () => {
  const market = {
    setData(value) {
      this.data = {
        ...this.data,
        ...value
      }
    },
    cb: (key, value) => {
      console.log(key, value);
      
    }
  }
  const setDataSpy = vi.spyOn(market, 'setData')
  const cbSpy = vi.spyOn(market, 'cb')
  const thisValue: ThisValueType = getThisValue({}, setDataSpy)
  const userStore = new MiniStore({
    state: {
      name: 'userStore',
      age: 18,
      id: '001'
    }
  })
  userStore.useData(thisValue, { total: true, cb: cbSpy as any, immediate: false })
  expect(setDataSpy).toHaveBeenCalledTimes(0)
  expect(cbSpy).toHaveBeenCalledTimes(0)
})

test("immediate为false时，不会执行cb函数", () => {
  const market = {
    setData(value) {
      this.data = {
        ...this.data,
        ...value
      }
    },
    cb: (key, value) => {
      console.log(key, value);
      
    }
  }
  const setDataSpy = vi.spyOn(market, 'setData')
  const cbSpy = vi.spyOn(market, 'cb')
  const thisValue: ThisValueType = getThisValue({}, setDataSpy)
  const userStore = new MiniStore({
    state: {
      name: 'userStore',
      age: 18,
      id: '001'
    }
  })
  userStore.useData(thisValue, { total: true, cb: cbSpy as any, immediate: false })
  expect(setDataSpy).toHaveBeenCalledTimes(0)
  expect(cbSpy).toHaveBeenCalledTimes(0)
})

test("store的数据应该是响应式的", () => {
  const thisValue: ThisValueType = getThisValue()

  const userStore = new MiniStore({
    state: {
      name: 'userStore',
      age: 18,
      id: '001'
    },
    actions: {
      changeNameAction(state) {
        state.name = 'userStore1'
      }
    }
  })

  userStore.useData(thisValue, { useKeys: ['name'] })

  expect(thisValue.data).toEqual({
    origin: 'xxx',
    name: 'userStore'
  })

  userStore.dispatch('changeNameAction')

  expect(thisValue.data).toEqual({
    origin: 'xxx',
    name: 'userStore1'
  })

})

test('使用unuseData后，thisValue所引用store的值不会变化了', () => {

  const thisValue: ThisValueType = getThisValue()

  const userStore = new MiniStore({
    state: {
      name: 'userStore',
      age: 18,
      id: '001'
    },
    actions: {
      changeNameAction(state, newName: string) {
        state.name = newName
      }
    }
  })

  userStore.useData(thisValue, { useKeys: ['name'] })

  expect(thisValue.data).toEqual({
    origin: 'xxx',
    name: 'userStore'
  })

  userStore.dispatch('changeNameAction', 'abc')

  expect(thisValue.data).toEqual({
    origin: 'xxx',
    name: 'abc'
  })

  userStore.unUseData(thisValue)
  userStore.dispatch('changeNameAction', 'cba')
  expect(thisValue.data).toEqual({
    origin: 'xxx',
    name: 'abc'
  })

})

test('使用多个store(setData)', () => {

  const market = {
    setData(value) {
      this.data = {
        ...this.data,
        ...value
      }
    }
  }
  const setDataSpy = vi.spyOn(market, 'setData')
  const thisValue: ThisValueType = getThisValue({}, setDataSpy)
  const userStore = new MiniStore({
    state: {
      name: 'userStore',
      age: 18,
      id: '001'
    },
    actions: {
      changeNameAction(state, newName: string) {
        state.name = newName
      }
    }
  })
  const dummyStore = new MiniStore({
    state: {
      friends: ['a', 'b', 'c']
    },
    actions: {
      changeFriendsAction(state, newFriends: any) {
        state.friends = newFriends
      }
    }
  })
  userStore.useData(thisValue, {total: true})
  expect(setDataSpy).toHaveBeenCalledTimes(1)

  dummyStore.useData(thisValue, {total: true})
  expect(setDataSpy).toHaveBeenCalledTimes(2)

  expect(thisValue.data).toEqual({
    name: 'userStore',
    age: 18,
    id: '001',
    friends: ['a', 'b', 'c']
  })

  userStore.dispatch('changeNameAction', 'abc')
  expect(setDataSpy).toHaveBeenCalledTimes(3)
  expect(thisValue.data).toEqual({
    name: 'abc',
    age: 18,
    id: '001',
    friends: ['a', 'b', 'c']
  })

  dummyStore.dispatch('changeFriendsAction', ['a'])
  expect(setDataSpy).toHaveBeenCalledTimes(4)
  expect(thisValue.data).toEqual({
    name: 'abc',
    age: 18,
    id: '001',
    friends: ['a']
  })

  userStore.unUseData(thisValue)
  userStore.dispatch('changeNameAction', 'unUser')
  expect(setDataSpy).toHaveBeenCalledTimes(4)
  expect(thisValue.data).toEqual({
    name: 'abc',
    age: 18,
    id: '001',
    friends: ['a']
  })

  dummyStore.dispatch('changeFriendsAction', ['a', 'b'])
  expect(setDataSpy).toHaveBeenCalledTimes(5)
  expect(thisValue.data).toEqual({
    name: 'abc',
    age: 18,
    id: '001',
    friends: ['a', 'b']
  })

  dummyStore.unUseData(thisValue)
  dummyStore.dispatch('changeFriendsAction', ['a'])
  expect(setDataSpy).toHaveBeenCalledTimes(5)
  expect(thisValue.data).toEqual({
    name: 'abc',
    age: 18,
    id: '001',
    friends: ['a', 'b']
  })
})

test('使用多个store(cb)', () => {

  const market = {
    cb(key, value) {
      console.log(key, value);
    }
  }
  const cbSpy = vi.spyOn(market, 'cb')
  const thisValue: ThisValueType = getThisValue({})
  const userStore = new MiniStore({
    state: {
      name: 'userStore',
      age: 18,
      id: '001'
    },
    actions: {
      changeNameAction(state, newName: string) {
        state.name = newName
      }
    }
  })
  const dummyStore = new MiniStore({
    state: {
      friends: ['a', 'b', 'c']
    },
    actions: {
      changeFriendsAction(state, newFriends: any) {
        state.friends = newFriends
      }
    }
  })
  userStore.useData(thisValue, {total: true, cb: cbSpy as any})
  // 这里total一共有三项所以会被执行3次
  expect(cbSpy).toHaveBeenCalledTimes(3)

  dummyStore.useData(thisValue, {total: true, cb: cbSpy as any})
  expect(cbSpy).toHaveBeenCalledTimes(4)

  userStore.dispatch('changeNameAction', 'abc')
  expect(cbSpy).toHaveBeenCalledTimes(5)

  dummyStore.dispatch('changeFriendsAction', ['a'])
  expect(cbSpy).toHaveBeenCalledTimes(6)

  userStore.unUseData(thisValue)
  userStore.dispatch('changeNameAction', 'unUser')
  expect(cbSpy).toHaveBeenCalledTimes(6)

  dummyStore.dispatch('changeFriendsAction', ['a', 'b'])
  expect(cbSpy).toHaveBeenCalledTimes(7)

  dummyStore.unUseData(thisValue)
  dummyStore.dispatch('changeFriendsAction', ['a'])
  expect(cbSpy).toHaveBeenCalledTimes(7)
})

