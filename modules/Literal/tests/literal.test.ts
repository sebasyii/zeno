import literal from '../literal';

const { l, LiteralString, isLiteralString } = literal;

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
    expect(l`hello`.concat(l`world`, '123')  == 'helloworld123').toBeTruthy();
    expect(l`hello`.concat(l`world`, '123') instanceof LiteralString).toBeFalsy();
    expect(l`hello`.concat(l`world`, l`123`)  == 'helloworld123').toBeTruthy();
    expect(l`hello`.concat(l`world`, l`123`) instanceof LiteralString).toBeTruthy();
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
    expect(l`hello`.replace(/l/g, () => 'L') instanceof LiteralString).toBeFalsy();
  });
});
