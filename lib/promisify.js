export default function promisify (func) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      args.push((err, ...args) => {
        if (err) return reject(err)
        resolve.apply(this, args)
      })
      func.apply(this, args)
    })
  }
}
