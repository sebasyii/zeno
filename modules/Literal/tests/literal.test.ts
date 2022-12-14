import literal from '../literal';

const { l, LiteralString, isLiteralString } = literal;

const arrayEqual = (array1: unknown[], array2: unknown[]): boolean => {
  return (
    array1.length === array2.length &&
    array1.every((value, index) => {
      return value == array2[index];
    })
  );
};

describe('#LiteralString', () => {
  it('class constructor', () => {
    expect(
      new LiteralString('SELECT * FROM users;') instanceof String,
    ).toBeTruthy();
    expect(
      new LiteralString('SELECT * FROM users;') instanceof LiteralString,
    ).toBeTruthy();
    expect(
      new LiteralString('SELECT * FROM users;') == 'SELECT * FROM users;',
    ).toBeTruthy();
    expect(
      new LiteralString('SELECT * FROM users;') === 'SELECT * FROM users;',
    ).toBeFalsy();

    const primitive: unknown = '';
    expect(primitive instanceof LiteralString).toBeFalsy();
    expect(primitive instanceof String).toBeFalsy();

    const stringObj: unknown = String('');
    expect(stringObj instanceof LiteralString).toBeFalsy();
  });

  it('template tag function', () => {
    expect(l`SELECT * FROM users;` instanceof String).toBeTruthy();
    expect(l`SELECT * FROM users;` instanceof LiteralString).toBeTruthy();

    const dbName = 'users';
    expect(() => l`SELECT * FROM ${dbName};`).toThrow(TypeError);
  });

  it('arguments', () => {
    expect(() => new LiteralString()).toThrow(TypeError);
    expect(() => new LiteralString('SELECT * FROM users;', 'extra')).toThrow(
      TypeError,
    );
    expect(() => new LiteralString(1)).toThrow(TypeError);
  });

  it('interpolation', () => {
    const s = l`hello`;
    const t = l`world`;
    const u = l`hello world`;
    const v = l`e ${s}${t}${u}`;

    const w = l`HELLO`;

    expect(isLiteralString(v)).toBeTruthy();
    expect(isLiteralString(w)).toBeTruthy();

    expect(v == 'e helloworldhello world').toBeTruthy();

    expect(() => {
      l`SELECT * FROM ${'users'};`;
    }).toThrow(TypeError);
    expect(
      l`SELECT * FROM ${l`users`};` == 'SELECT * FROM users;',
    ).toBeTruthy();
    expect(l`SELECT * FROM ${l`users`};` instanceof LiteralString).toBeTruthy();
  });

  it('concatenation', () => {
    const x: unknown = l`SELECT * FROM ` + 'users;';
    expect(x).toBe('SELECT * FROM users;');
    expect(x instanceof LiteralString).toBeFalsy();

    expect(l`hello`.concat('world') == 'helloworld').toBeTruthy();
    expect(l`hello`.concat('world') instanceof LiteralString).toBeFalsy();
    expect(l`hello`.concat(l`world`) == 'helloworld').toBeTruthy();
    expect(l`hello`.concat(l`world`) instanceof LiteralString).toBeTruthy();
    expect(l`hello`.concat(l`world`, '123') == 'helloworld123').toBeTruthy();
    expect(
      l`hello`.concat(l`world`, '123') instanceof LiteralString,
    ).toBeFalsy();
    expect(l`hello`.concat(l`world`, l`123`) == 'helloworld123').toBeTruthy();
    expect(
      l`hello`.concat(l`world`, l`123`) instanceof LiteralString,
    ).toBeTruthy();
  });

  it('replace', () => {
    expect(l`hello`.replace('l', 'L') == 'heLlo').toBeTruthy();
    expect(l`hello`.replace('l', 'L') instanceof LiteralString).toBeFalsy();
    expect(l`hello`.replace(l`l`, 'L') == 'heLlo').toBeTruthy();
    expect(l`hello`.replace(l`l`, 'L') instanceof LiteralString).toBeFalsy();
    expect(l`hello`.replace(l`l`, l`L`) == 'heLlo').toBeTruthy();
    expect(l`hello`.replace(l`l`, l`L`) instanceof LiteralString).toBeTruthy();

    expect(l`hello`.replace(/l/g, 'L') == 'heLLo').toBeTruthy();
    expect(l`hello`.replace(/l/g, 'L') instanceof LiteralString).toBeFalsy();
    expect(l`hello`.replace(/l/g, l`L`) == 'heLLo').toBeTruthy();
    expect(l`hello`.replace(/l/g, l`L`) instanceof LiteralString).toBeTruthy();

    expect(l`hello`.replace(/l/g, () => 'L') == 'heLLo').toBeTruthy();
    expect(
      l`hello`.replace(/l/g, () => 'L') instanceof LiteralString,
    ).toBeFalsy();
  });

  it('slice', () => {
    expect(l`hello`.slice(0) == 'hello').toBeTruthy();
    expect(l`hello`.slice(1, 3) == 'el').toBeTruthy();
    expect(l`hello`.slice(1, 3) instanceof LiteralString).toBeTruthy();
  });

  it('split', () => {
    expect(arrayEqual(l``.split(), [''])).toBeTruthy();
    expect(arrayEqual(l`hello`.split(), ['hello'])).toBeTruthy();
    expect(
      arrayEqual(l`hello,world`.split(','), ['hello', 'world']),
    ).toBeTruthy();
    expect(l`hello,world`.split(',')[0] instanceof LiteralString).toBeTruthy();
    expect(l`hello,world`.split(',')[1] instanceof LiteralString).toBeTruthy();

    expect(
      l`Harry Trump ;Fred Barney; Helen Rigby ; Bill Abel ;Chris Hand `.split(
        /\s*(?:;|$)\s*/,
      )[0] == 'Harry Trump',
    ).toBeTruthy();
    expect(
      l`Harry Trump ;Fred Barney; Helen Rigby ; Bill Abel ;Chris Hand `.split(
        /\s*(?:;|$)\s*/,
      )[0] instanceof LiteralString,
    ).toBeTruthy();
  });

  it('substring', () => {
    expect(l`hello`.substring(0) == 'hello').toBeTruthy();
    expect(l`hello`.substring(1, 3) == 'el').toBeTruthy();
    expect(l`hello`.substring(1, 3) instanceof LiteralString).toBeTruthy();
  });

  it('casing', () => {
    expect(l`hello`.toUpperCase() == 'HELLO').toBeTruthy();
    expect(l`hello`.toUpperCase() instanceof LiteralString).toBeTruthy();
    expect(l`hello`.toLowerCase() == 'hello').toBeTruthy();
    expect(l`hello`.toLowerCase() instanceof LiteralString).toBeTruthy();
  });

  it('trim', () => {
    expect(l`hello`.trim() == 'hello').toBeTruthy();
    expect(l`hello`.trim() instanceof LiteralString).toBeTruthy();
    expect(l` hello `.trim() == 'hello').toBeTruthy();
    expect(l` hello `.trim() instanceof LiteralString).toBeTruthy();

    expect(l`hello`.trimStart() == 'hello').toBeTruthy();
    expect(l`hello`.trimStart() instanceof LiteralString).toBeTruthy();
    expect(l` hello `.trimStart() == 'hello ').toBeTruthy();
    expect(l` hello `.trimStart() instanceof LiteralString).toBeTruthy();

    expect(l`hello`.trimEnd() == 'hello').toBeTruthy();
    expect(l`hello`.trimEnd() instanceof LiteralString).toBeTruthy();
    expect(l` hello `.trimEnd() == ' hello').toBeTruthy();
    expect(l` hello `.trimEnd() instanceof LiteralString).toBeTruthy();
  });
});
