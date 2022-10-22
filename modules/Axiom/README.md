# Axiom

Prevents Server-Side Request Forgery (SSRF) attacks by securing all outgoing HTTP requests. To prevent DNS rebinding attacks and other bypass techniques, hosts and IP addresses are checked at lookup-time (after resolving the host name but before connecting).

By default, Axiom only blocks private IP addresses:

- `10.0.0.0/8`
- `172.16.0.0/12`
- `192.168.0.0/16`
- `fd00::/8`

## ACLs

An access control list (ACL) can be specified in a YAML-formatted file. 

- Each host, IP address or CIDR range can be set to either `allow` or `deny`.
- The ACL is applied from **top to bottom**. The **first match** rule will be applied.
- The end of an ACL is an **implicit `deny`**. If no match is found, access is denied by default.
- To configure an "implicit `allow`" (i.e. `allow`-all), an `allow` rule must be added to the end of the ACL.
- For convenience, using `match: private_addresses` will match all private address ranges above. This should be placed above the `allow`-all if one is used.

A host can be specified with or without a globbing **prefix**.

| host                | valid   |
| ------------------- | ------- |
| `example.com`       | yes     |
| `*.example.com`     | yes     |
| `api.*.example.com` | no      |
| `*example.com`      | no      |
| `ex*ample.com`      | no      |
| `example.*`         | hell no |