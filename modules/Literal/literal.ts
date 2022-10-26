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

const l = (strings, ...values) => {
    if (values.length !== 0)
        throw new TypeError('Literal strings must not contain any interpolations');
    return new LiteralString(strings.join(''));
}

export { LiteralString, l };