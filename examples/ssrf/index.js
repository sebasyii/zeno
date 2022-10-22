(async () => {

    const axios = require('axios');
    const { Axiom } = require('zeno');

    new Axiom({
        acl: [
            {
                match: "evil.github.com",
                action: "deny"
            },
            {
                match: "*.github.com",
                action: "allow"
            },
            {
                match: "2001:db8::/32",
                action: "deny"
            },
            {
                match: "1.0.0.0/8",
                action: "deny"
            },
            {
                match: "*",
                action: "allow"
            }
        ]
    })

    const urls = [
        "http://example.com/",
        "http://google.com",
        "http://evil.github.com",
        "http://gtfobins.github.io",
        "http://1.1.1.1",
        "http://127.0.0.1",
    ]

    for (const url of urls) {
        await axios.get(url)
            .then((response) => {
                console.log(`[+] ${url} => ${response.status}`)
            })
            .catch((error) => {
                console.log(`${error.toString().split('\n')[0]}`);
            })
    }
})();

