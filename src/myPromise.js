const PENDING = 'pending'
const FULLFILLED = 'fullfilled'
const REJECT = 'rejected'

const isFunction = func => typeof func === 'function'

class MyPromise {
  static resolve(value) {
    if (value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) throw Error('must be a array')
      const results = []
      const len = promises.length
      let current = 0

      for(let i = 0; i < len; i++) {
        MyPromise.resolve(promises[i]).then(result => {
          results[i] = result
          current++
          if (current === len) {
            resolve(results)
          }
        }, error => {
          reject(error)
        })
      }
    })
  }

  constructor(callback) {
    // 初始化Promise状态，promise具有三种状态：pending, fullfilled, rejected
    this.promiseState = PENDING
    this.promiseResult = undefined

    // resolve的回调
    this.fullfilledCallback = []
    // reject的回调
    this.rejectedCallback = []

    // 构造函数中直接执行传入的方法，同时在callback中注入resolve，reject两个方法
    if(isFunction(callback)) {
      // 如果callback执行出错，则直接执行reject方法
      try {
        callback(this.resolve, this.reject)
      } catch(err) {
        this.reject(err)
      }
    } else {
      throw Error('TypeError: 传入的参数必须是一个function')
    }
  }

  // 此处通过箭头函数绑定this的指向为Promise的实例，也可以在构造函数中使用bind进行绑定
  resolve = (value) => {
    // 如果状态不为PENDING，则直接退出
    if (this.promiseState !== PENDING) return
    this.promiseState = FULLFILLED
    this.promiseResult = value

    // 如果回调队列不为空，则调用回调队列中的方法
    if (this.fullfilledCallback.length) {
      this.fullfilledCallback.forEach(fn => this._handle(fn))
    }
    this.fullfilledCallback.length = 0
  }

  reject = (value) => {
    if (this.promiseState !== PENDING) return
    this.promiseState = REJECT
    this.promiseResult = value

    if (this.rejectedCallback.length) {
      this.rejectedCallback.forEach(fn => this._handle(fn))
    }
    this.rejectedCallback.length = 0
  }
  // then方法接收两个参数，分别对应的是成功和失败的回调
  then = (onResolved, onRejected) => {
    const _onResolved = isFunction(onResolved) ? onResolved : r => r
    const _onRejected = isFunction(onRejected) ? onRejected : r => { throw r }

    return new MyPromise((resolve, reject) => {
      this._handle({
        resolve,
        reject,
        onResolved: _onResolved,
        onRejected: _onRejected
      })
    })
  }

  _handle = ({ onResolved, onRejected, resolve, reject }) => {
    try {
      if (this.promiseState === FULLFILLED) {
        const result = onResolved(this.promiseResult)
        if (result instanceof MyPromise) {
          result.then(resolve, reject)
        } else {
          resolve(result)
        }
      } else if (this.promiseState === REJECT) {
        const result = onRejected(this.promiseResult)
        if (result instanceof MyPromise) {
          result.then(resolve, reject)
        } else {
          reject(result)
        }
      } else {
         // 如果此时状态为pending，则把参数信息保存到两个回调队列里（现在其实只需要用一个数组来保存就好了）
        this.fullfilledCallback.push({ onResolved, onRejected, resolve, reject })
        this.rejectedCallback.push({ onResolved, onRejected, resolve, reject })
      }
    } catch (err) {
      // 如果执行报错了，则调用传入的reject方法来抛出错误信息
      reject(err)
    }
  }
}

export default MyPromise