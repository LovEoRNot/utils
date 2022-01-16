// 节流函数

function throttle(fn, delay, immediate) {
    let timer = null
    let canCallNow = immediate
    return function(...args) {
        if (canCallNow) {
            canCallNow = false
            fn.call(this, ...args)
            timer = setTimeout(() => {
                timer = null
            }, delay);
        }

        if (!timer) {
            timer = setTimeout(() => {
                fn.call(this, ...args)
                timer = null
            }, delay);
        }
    }
}