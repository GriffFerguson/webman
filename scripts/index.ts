import * as mongo from "mongodb";
import * as express from "express";
import { readFileSync } from "fs";

interface config {
    port: number,
    dbURL: string
}

const config: config = JSON.parse(readFileSync("./webman.config.json", {encoding: 'utf8'}));
const app = express().listen(config.port);
const client = new mongo.MongoClient(config.dbURL);

app.route('/auth')
    .get((req, res) => {
        res.send('Open page');
    })
    .post((req, res) => {
        res.send('Send login details');
    })