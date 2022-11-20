# Cf-Mp-Store

**一个响应式的小程序全局状态管理库**

## 如何使用

### 1.安装依赖

``` 
npm install cf-mp-store

yarn add cf-mp-store

pnpm add cf-mp-store
```

### 2.创建store对象

```ts
import MpStore from 'cf-mp-store'

const userStore = new MpStore({
  state: {
    name: 'userStore'
  },
  actions: {
    changeNameAction(state, newName: string) {
      state.name = newName
    }
  }
})

export default userStore
```

### 3.使用store

```ts
// 小程序页面的ts文件
import userStore from 'xxx'
Page({
  data: {

  },

  onLoad() {
    userStore.useData(this, { 
      useKeys: ['name'],  // 所需引入的state的key
      // total: true,     // 是否需要引入整个store.state，默认为false，且优先级比useKeys高
      // immediate: true  // 是否立即执行 默认为true，后续介绍
      // cb: (key, value)  // 回调函数，默认为undefined，后续介绍
    })
  },
  onUnLoad() {
    userStore.unUseData(this)
  }
})
```

- 只需要在**页面的onLoad**或者组件的**attached**调用store对象的useData即可将对应的数据保存到页面的data中。
- 然后直接在wxml中使用即可。
- 当组件或者页面销毁时，可以调用**store.unUseData**清除store与页面的联系

## useData的参数说明

```ts
interface OptionsType {
  useKeys?: string[];
  cb?: (key: string, value: any) => any;
  immediate?: boolean;
  total?: boolean
}
// 第一个参数instance是小程序的页面或者组件实例
store.useData(instance, options: OptionsType)
```

- useKeys用于指定所要引入的 store.state 。
- total如果为true，则表示要将整个store.state都引入进来。
- immediate: 
  - 默认情况下，只要调用了store.useData()，那么就会立即调用this.setData()来将store的值保存到页面data中。如果immediate设置为false，那么调用store.useData()时不会立即调用this.setData()，而是等到下一次store.state发生变化时，才会调用this.setData()将值保存到页面data中。
  - 很多时候我们都会先在state中定义空数据，然后再调用dispatch去发送网络请求并且将请求结果保存到之前定义的空数据中，那么这个时候我们就可以将immediate设置为false。

```ts
import MpStore from 'cf-mp-store'

const userStore = new MpStore({
  state: {
    list: []
  },
  actions: {
    async fetchList(state, ...args) {
      // 发送网络请求
      const res = await getList()
      state.list = res.list
    }
  }
})

// 小程序ts文件
Page({
  data: {},
  onLoad: {
    userStore.useData(this, {
    	useKeys: ['list'],
  		immediate: false
  	})
		// immediate为false，所以这里的时候，data中并没有list数据
		
		// 调用dispatch去发送网络请求，然后再将结果保存到store中。修改了state.list值，会执行this.setData()
		userStore.dispatch('fetchList')
  }
})
```

- cb参数（**推荐使用箭头函数**）:
  - 如果传递了cb参数，那么在state发生变化时，不会调用this.setData()，而是会回调cb。
  - 当我们需要对引入的state的key进行重命名时，可以通过传递cb参数实现。

```ts
import MpStore from 'cf-mp-store'

const userStore = new MpStore({
  state: {
    name: 'userStore'
  }
})

// 小程序ts文件
Page({
  data: {},
  onLoad: {
    userStore.useData(this, {
    	useKeys: ['name'],
  		cb: (key, value) => {
  			const newKey = `${key}123`  // name123
  			this.setData({
          [newKey]: value
        })
			}
  	})
  }
})
```

