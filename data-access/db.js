const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const connectionString = `postgres://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DATABASEPORT}/${process.env.DATABASE}`;

const connection = {
    connectionString: process.env.DATABASE_URL
        ? process.env.DATABASE_URL
        : connectionString,
    ssl: { rejectUnauthorized: false },
};
const pool = new Pool(connection);
