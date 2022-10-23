(async () => {

    const axios = require('axios');
    const { axiom } = require('zeno');

    axiom("./sample_config.yaml")

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
