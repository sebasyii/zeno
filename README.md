# Zeno

A collection of modules to secure your [express.js](https://github.com/visionmedia/express) application.

https://user-images.githubusercontent.com/39144422/198509504-21ebaa6e-26e1-4eef-9643-9d4419c5b58f.mp4

[Watch on YouTube](https://www.youtube.com/watch?v=zPScLYLaZ4s)

## Modules

- [**Literal**](./modules/Literal/), preventing [injection attacks](https://www.acunetix.com/blog/articles/injection-attacks/) through string safety.
- [**Peg**](./modules/Peg/), an [Express](https://github.com/expressjs/express) middleware and process control system that prevents [application-level DOS](https://www.invicti.com/blog/web-security/application-level-denial-service-guide/) attacks by stopping computationally expensive route handlers after a timeout.
- [**Axiom**](./modules/Axiom/), an ACL filter that prevents [SSRF](https://portswigger.net/web-security/ssrf) attacks by restricting connections at lookup-time.
- [**Indirect**](./modules/Indirect/), an [Express](https://github.com/expressjs/express) middleware that prevents [IDOR](https://portswigger.net/web-security/access-control/idor) vulnerabilities by securely converting between internal and external-facing object identifiers.

## Installation

```bash
npm i @zenots/zeno
```

Also make sure that you have Node.js 8 or newer in order to use it.

## Changelog

Check the [GitHub Releases page](https://github.com/sebasyii/zeno/releases).

## License

MIT License
