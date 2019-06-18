export default function match(matchers, defaultValue) {
  /* eslint-disable no-restricted-syntax */
  for (const [condition, value] of matchers) {
    if (condition) {
      return value;
    }
  }
  /* eslint-enable */

  return defaultValue;
}
