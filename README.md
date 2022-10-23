# Zeno

A collection of modules to secure your [express.js](https://github.com/visionmedia/express) application.

- [**Indirect**](./modules/Indirect/), an [Express](https://github.com/expressjs/express) middleware that prevents [IDOR](https://portswigger.net/web-security/access-control/idor) vulnerabilities by securely converting between internal and external-facing object identifiers.
- [**Axiom**](./modules/Axiom/), an ACL filter that prevents [SSRF](https://portswigger.net/web-security/ssrf) attacks by restricting connections at lookup-time.
- [**Regal**](./modules/Regal), a regular expression wrapper that prevents [ReDoS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) through catastrophic backtracking.
- [**Envy**](./modules/Envy), environemnt variable stuff lol idk
- [**Cradle**](./modules/Cradle/), a [cross-site websocket hijacking](https://portswigger.net/web-security/websockets/cross-site-websocket-hijacking) filter for the [ws](https://github.com/websockets/ws) library.

## Installation

```bash
npm install zeno
```

or

```bash
yarn add zeno
```

Also make sure that you have Node.js 8 or newer in order to use it.

## Documentation

See how

## Changelog

Check the [GitHub Releases page](https://github.com/sebasyii/zeno/releases).

## License

MIT License
