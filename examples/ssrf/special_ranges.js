(async () => {

    const axios = require('axios');
    const { axiom } = require('zeno');

    axiom(
        [
            {
                match: "special_ranges",
                action: "deny"
            },
            {
                match: "*",
                action: "allow"
            }
        ]
    )

    const urls = [
        "http://example.com/",
        "http://google.com",
        "http://evil.github.com",
        "http://gtfobins.github.io",
        "http://1.1.1.1",
        "http://127.0.0.1",
        "http://192.168.1.1",
        "http://169.254.169.254",
    ]

    for (const url of urls) {
        await axios.get(url, { timeout: 1000 })
            .then((response) => {
                console.log(`[+] ${url} => ${response.status}`)
            })
            .catch((error) => {
                console.log(`${error.toString().split('\n')[0]}`);
            })
    }
})();

