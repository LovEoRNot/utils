// 防抖函数

export default function debounce(fn, delay, immediate) {
    let timer = null
    return function(...args) {
        if (timer) {
            clearTimeout(timer)
        }
        if (immediate) {
            const canCallNow = !timer
            timer = setTimeout(() => {
                timer = null
            }, wait);
            if (canCallNow) {
                fn.call(this, ...args)
            }
        } else {
            timer = setTimeout(() => {
                fn.call(this, ...args)
            }, delay);
        }
    }
}