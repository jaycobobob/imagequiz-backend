const bcrypt = require("bcrypt");
const res = require("express/lib/response");
const { Pool } = require("pg");
require("dotenv").config();

const connectionString = `postgress://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_DATABASEPORT}/${process.env.DB_DATABASE}`;
const connection = {
    connectionString: process.env.DATABASE_URL ? process.env.DATABASEURL : connectionString,
    ssl: { rejectUnauthorized: false },
};
const pool = new Pool(connection);
let store = {
    addCustomer: (name, email, password) => {
        let hash = bcrypt.hashSync(password, 10);
        return pool.query(
            "insert into imagequiz.customer (name, email, password) values ($1 , $2 , $3)",
            [name, email, hash]
        );
    },

    login: (email, password) => {
        return pool.query("select name, email, password from imagequiz.customer where email = $1", [
            email,
        ]);
    },

    getFlowers: () => {
        return pool.query("select * from imagequiz.flowers");
    },
};

module.exports = { store };
