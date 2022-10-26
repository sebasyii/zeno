import literal, { StringLiteral } from '../literal';

const { l, LiteralString } = literal;

describe('#LiteralString', () => {

    it('class constructor', () => {
        expect(new LiteralString('SELECT * FROM users;') instanceof String).toBeTruthy();
        expect(new LiteralString('SELECT * FROM users;') instanceof LiteralString).toBeTruthy();
        expect(new LiteralString('SELECT * FROM users;') == 'SELECT * FROM users;').toBeTruthy();
        expect(new LiteralString('SELECT * FROM users;') === 'SELECT * FROM users;').toBeFalsy();

        const primitive: unknown = "";
        expect(primitive instanceof LiteralString).toBeFalsy();
        expect(primitive instanceof String).toBeFalsy();

        const stringObj: unknown = String("");
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
        expect(() => new LiteralString('SELECT * FROM users;', 'extra')).toThrow(TypeError);
        expect(() => new LiteralString(1)).toThrow(TypeError);
    })

    it('concatenation', () => {
        const s: unknown = l`SELECT * FROM ` + 'users;';
        expect(s).toBe('SELECT * FROM users;');
        expect(s instanceof LiteralString).toBeFalsy();

        expect(() => { l`SELECT * FROM ${'users;'}` }).toThrow(TypeError);
        expect(l`SELECT * FROM ${l`users;`}` == 'SELECT * FROM users;').toBeTruthy();
        expect(l`SELECT * FROM ${l`users;`}` instanceof LiteralString).toBeTruthy();
    });

});