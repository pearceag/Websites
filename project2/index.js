const express = require('express');
const mysql = require('mysql');
const fs = require('fs');

service.use(express.json());

const json = fs.readFileSync('credentials.json', 'utf8');
const credentials = JSON.parse(json)

const connection = mysql.createConnection(credentials);

connection.connect(err => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('MySQL Connected')
});

const service = express()

// Endpoints


const port = 5000;
service.listen(port, () => {
    console.log(`We're live on port ${port}!`);
});

connection.end();