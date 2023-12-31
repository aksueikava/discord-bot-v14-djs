const { Client, Collection } = require('discord.js');
const { MongoClient } = require('mongodb');
const { Handler } = require('./handler')
class AkvityxsClient extends Client {
    constructor(options) {
        super(options)
        this.mongoDb = new MongoClient(this.options.url)
        this.handler = new Handler(this)
        this.invitedMemberCache = new Collection()
    }
    database;

    async init() {
        await this.mongoDb.connect()
            .then(() => {
                console.log(`[DATABASE]`, `Connected to MongoDB`)
                return this.database = this.mongoDb.db('AkvityxsClientDB')
            })
            .catch(error => console.log(`[DATABASE]`, `Failed to connect to MongoDB`, error));

        await this.getEvents()
            .then(() => console.log(`[HANDLER]`, `Events are loaded`))
            .catch(error => console.log(`[HANDLER]`, error));

        await this.login(this.options.token)
            .then(() => console.log(`[LOGIN]`, `Logged as ${this.user.username}`))
            .catch(error => console.log(`[LOGIN]`, error));
    }
    async getEvents() {
        this.handler.events.forEach(event => {
            if (event.once) {
                this.once(event.name, (...args) => event.execute(...args));
                console.log(`[EVENT]`, `${event.name} is loaded`)
            } else {
                this.on(event.name, (...args) => event.execute(...args))
                console.log(`[EVENT]`, `${event.name} is loaded`)
            }
        })
    }
    getBotOwnerId() {
        return process.env.OWNER_ID;
    }

    getGuildId() {
        return process.env.GUILD_ID;
    }
}

module.exports = AkvityxsClient;
