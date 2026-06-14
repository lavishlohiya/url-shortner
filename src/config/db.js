const { Client } = require("pg");

const pool = new Client({
    connectionString: process.env.DATABASE_URL
})

pool.connect().then(() => console.log("DB connected"));

module.exports = pool;