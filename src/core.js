require('dotenv').config();
const AkvityxsClient = require('./classes/client');
const { intents, partials } = require('./config.json')

const config = {
        intents,
        partials,
        token: process.env.TOKEN,
        url: process.env.DB_URL,
        failIfNotExists: false
}

const client = new AkvityxsClient(config);

client.init()
    .then(() => console.log(`[INIT]`, `All systems initiated`))
    .catch(error => console.log(`[INIT]`, error));
