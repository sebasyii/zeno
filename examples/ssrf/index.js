const axios = require('axios');
const { Axiom } = require('zeno');

new Axiom({
    whitelist: [],
    blacklist: [],
})

axios.get("http://example.com")
    .then((response) => {
        console.log(response.data);
    })
    .catch((error) => {
        console.log(`${error.toString().split('\n')[0]}`);
    })


