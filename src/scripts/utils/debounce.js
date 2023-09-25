/**
 * This function is used to debounce any event.
 * A debounce function is a function that is called only once after a specified time.
 * You cant call the function immediately after it is debounced.
 * It will wait until the time has passed and then call the function.
 * @param {Function} fn Function to debounce
 * @param {*} wait Time to wait before calling function
 * @returns The debounced function
 */
export function debounce(fn, wait) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), wait)
  }
}
