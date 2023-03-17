const slowDown =
  (ms) =>
  ({ next }) =>
    setTimeout(() => next(), ms)

export default slowDown
