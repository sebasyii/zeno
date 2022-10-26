class LiteralString extends String {
    constructor(...args) {
        if (args.length !== 1)
            throw new TypeError('LiteralString constructor must be called with exactly one argument');
        if (typeof args[0] !== 'string')
            throw new TypeError('LiteralString constructor must be called with a string argument');
        super(...args);
        return this;
    }
}

const l = (strings: TemplateStringsArray, ...values: LiteralString[]) : LiteralString => {
    let result = '';
    for (let i = 0; i < strings.length - 1; i++) {
        if (values[i] instanceof LiteralString)
            result += strings[i] + values[i];
        else
            throw new TypeError('All values must be literal strings');
    }
    result += strings[strings.length - 1];
    return new LiteralString(result);
}

export default { l, LiteralString };