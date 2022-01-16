// import MyPromise from "../src/myPromise";

// describe('Promise具备基本的功能', () => {
//   test('实例化promise对象时，callback能够立即执行', () => {
//     let excuteTime
//     const promise = new MyPromise(() => {
//       excuteTime = +new Date()
//     })
//     const now = +new Date()

//     expect(now).toBeGreaterThanOrEqual(excuteTime)
//   });

//   test('调用promise实例的than方法时，能正确获取到成功的结果', (done) => {
//     const promise = new MyPromise((resolve) => {
//       resolve(1)
//     })
//     promise.then(result => {
//       expect(result).toBe(1)
//       done()
//     })
//   });

//   test('调用promise实例的than方法时，能正确获取到失败的结果', (done) => {
//     const promise2 = new MyPromise((resolve, reject) => {
//       reject(Error('error'))
//     })
//     promise2.then(() => {}, error => {
//       expect(error.message).toBe('error')
//       done()
//     })
//   });

//   test('promise只会被resolve或reject一次，多次执行不能修改状态', done => {
//     const promise = new MyPromise((resolve) => {
//       resolve(1)
//       resolve(2)
//     })

//     promise.then(result => {
//       expect(result).toBe(1)
//       done()
//     })
//   })

//   test('实例化promise中包含异步操作时，resolve也能获取到对应的结果', (done) => {
//     const promise = new MyPromise(resolve => {
//       setTimeout(() => {
//         resolve(1)
//       }, 1000);
//     })

//     promise.then(result => {
//       expect(result).toBe(1)
//       done()
//     })
//   });

//   test('resolve先执行时，then方法也会等到同步代码执行完毕后才执行', (done) => {
//     const promise = new MyPromise(resolve => {
//       resolve(2)
//     })

//     promise.then(result => {
//       expect(result).toBe(2)
//       done()
//     })
//   });

//   test('Promise支持链式调用--resolve', (done) => {
//     const promise = new MyPromise(resolve => {
//       setTimeout(() => {
//         resolve(1)
//       }, 1000);
//     })

//     promise
//     .then(result => result)
//     .then(result => {
//       return new MyPromise(resolve => {
//         setTimeout(() => {
//           resolve(result)
//         }, 2000);
//       })
//     }).then(result => {
//       expect(result).toBe(1)
//       done()
//     })
//   });

//   test('Promise.all能正确返回结果', (done) => {
//     const p1 = new MyPromise(r => r(1))
//     const p2 = new MyPromise(r => {
//       setTimeout(() => {
//         r(2)
//       }, 1000);
//     })
//     MyPromise.all([p1, p2, 3]).then(res => {
//       expect(res[0]).toBe(1)
//       expect(res[1]).toBe(2)
//       expect(res[2]).toBe(3)
//       done()
//     })
//   });
// });