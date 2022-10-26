import literal from '../literal';

const { l, LiteralString } = literal;

describe('#LiteralString', () => {

    it('class constructor', () => {
        expect(new LiteralString('SELECT * FROM users;') instanceof String).toBeTruthy();
        expect(new LiteralString('SELECT * FROM users;') instanceof LiteralString).toBeTruthy();
        expect(new LiteralString('SELECT * FROM users;') == 'SELECT * FROM users;').toBeTruthy();
        expect(new LiteralString('SELECT * FROM users;') === 'SELECT * FROM users;').toBeFalsy();

        const primitive: any = "";
        expect(primitive instanceof LiteralString).toBeFalsy();
        expect(primitive instanceof String).toBeFalsy();

        const stringObj: String = String("");
        expect(stringObj instanceof LiteralString).toBeFalsy();
    });

    it('template tag function', () => {
        expect(l`SELECT * FROM users;` instanceof String).toBeTruthy();
        expect(l`SELECT * FROM users;` instanceof LiteralString).toBeTruthy();

        const dbName = 'users';
        expect(() => l`SELECT * FROM ${dbName};`).toThrow(TypeError);
    });


    it('concatenation', () => {
        const s: any = l`SELECT * FROM ` + 'users;';
        expect(s).toBe('SELECT * FROM users;');
        expect(s instanceof LiteralString).toBeFalsy();

        expect(() => { l`SELECT * FROM ${'users;'}` }).toThrow(TypeError);
        expect(l`SELECT * FROM ${l`users;`}` == 'SELECT * FROM users;').toBeTruthy();
        expect(l`SELECT * FROM ${l`users;`}` instanceof LiteralString).toBeTruthy();
    });

});