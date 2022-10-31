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

  // @ts-expect-error return type is LiteralString
  concat(...args: (LiteralString | string)[]): LiteralString | string {
    if (!args.every((arg) => isLiteralString(arg)))
      return super.concat(...args as string[]);
    return new LiteralString(super.concat(...args as string[]));
  }

  // @ts-expect-error return type is LiteralString
  replace(pattern: LiteralString | string | RegExp, replacement: LiteralString | string | ((substring: string, ...args: any[]) => string)): LiteralString | string {
    if (!isLiteralString(replacement))
      return super.replace(pattern as string | RegExp, replacement);
    return new LiteralString(super.replace(pattern as string | RegExp, replacement as string));
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
