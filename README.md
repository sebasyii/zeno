# Zeno

A collection of modules to secure your [express.js](https://github.com/visionmedia/express) application.

- [**Indirect**](./modules/Indirect/), an [Express](https://github.com/expressjs/express) middleware that prevents [IDOR](https://portswigger.net/web-security/access-control/idor) vulnerabilities by securely converting between internal and external-facing object identifiers.
- [**Axiom**](./modules/Axiom/), an ACL filter that prevents [SSRF](https://portswigger.net/web-security/ssrf) attacks by restricting connections at lookup-time.
- [**Cradle**](./modules/Cradle/), a [cross-site websocket hijacking](https://portswigger.net/web-security/websockets/cross-site-websocket-hijacking) filter for the [ws](https://github.com/websockets/ws) library.

## Installation

```
npm install zeno
```

or

```
yarn add zeno
```

Also make sure that you have Node.js 8 or newer in order to use it.

## Documentation

See how

## Changelog

Check the [GitHub Releases page](https://github.com/sebasyii/zeno/releases).

## License

MIT License
