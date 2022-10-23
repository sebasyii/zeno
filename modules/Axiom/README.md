# Axiom

Prevents Server-Side Request Forgery (SSRF) attacks by securing all outgoing HTTP requests. To prevent DNS rebinding attacks and other bypass techniques, hosts and IP addresses are checked at lookup-time (after resolving the host name but before connecting).

By default, Axiom will block all [special address blocks](https://en.wikipedia.org/wiki/Reserved_IP_addresses). This should be sufficient for general use cases. For more complex use cases, see [ACLs](#acls).

## ACLs

An access control list (ACL) can be specified in a YAML-formatted file.

- Each host, IP address or CIDR range can be set to either `allow` or `deny`.
- The ACL is applied from **top to bottom**. The **first match** rule will be applied.
- The end of an ACL is an **implicit `deny`**. If no match is found, access is denied by default.
- To configure an "implicit `allow`" (i.e. `allow`-all), an `allow` rule must be added to the end of the ACL.
- For convenience, using `match: special_ranges` will match all [special address blocks](https://en.wikipedia.org/wiki/Reserved_IP_addresses). This should be placed above the `allow`-all if one is used.

A host can be specified with or without a globbing **prefix**.

| host                | valid   |
| ------------------- | ------- |
| `*`                 | yes     |
| `example.com`       | yes     |
| `*.example.com`     | yes     |
| `api.*.example.com` | no      |
| `*example.com`      | no      |
| `ex*ample.com`      | no      |
| `example.*`         | hell no |

The invalid patterns above are inherently dangerous - domains should only be trusted from higher to lower levels. Trusting any domain starting with `example.` is as good as trusting any arbitrary domain.

## Example Usage

Upon loading Axiom, it will automatically apply the ACL rules to **all** outgoing HTTP requests. There is no need to manually use Axiom for each request. This helps to prevent accidental misconfigurations and unintentional requests.

Using Axiom with the default configuration will block all special address blocks.

```javascript
const { axiom } = require('zeno');

axiom();
```

To configure Axiom with a YAML file, simply provide the filename.

```javascript
const { axiom } = require('zeno');

axiom('./sample_config.yaml');
```

A sample configuration can be found [here](../../examples/ssrf/sample_config.yaml).

Alternatively, provide the ACL as an array of rules.

```javascript
const { axiom } = require('zeno');

axiom([
  {
    match: 'evil.github.com',
    action: 'deny',
  },
  {
    match: '*.github.com',
    action: 'allow',
  },
  {
    match: '2001:db8::/32',
    action: 'deny',
  },
  {
    match: '1.0.0.0/8',
    action: 'deny',
  },
  {
    match: '*',
    action: 'allow',
  },
]);
```

The following is equivalent to running Axiom with the default configuration.

```javascript
const { axiom } = require('zeno');

axiom([
  {
    match: 'special_ranges',
    action: 'deny',
  },
  {
    match: '*',
    action: 'allow',
  },
]);
```

More examples can be found [here](../../examples/ssrf/).
