const isLiteralString = (value: unknown): value is LiteralString =>
  value instanceof LiteralString;

class LiteralString extends String {
  constructor(...args: unknown[]) {
    if (args.length !== 1)
      throw new TypeError(
        'LiteralString constructor must be called with exactly one argument',
      );
    if (typeof args[0] !== 'string')
      throw new TypeError(
        'LiteralString constructor must be called with a string argument',
      );
    super(...args);
    return this;
  }
}

const l = (
  strings: TemplateStringsArray,
  ...values: LiteralString[]
): LiteralString => {
  const result = strings.reduce((acc, str, i) => {
    if (isLiteralString(values[i])) return acc + str + values[i];
    if (i === strings.length - 1) return acc + str;
    else throw new TypeError('All values must be literal strings');
  }, '');
  return new LiteralString(result);
};

export default { l, LiteralString, isLiteralString };
