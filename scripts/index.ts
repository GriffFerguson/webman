import * as mongo from "mongodb";
import { join } from "path"
import express from "express";
import { readFileSync, createReadStream } from "fs";

interface config {
    port: number,
    dbURL: string
}

var config: config;

try {
    config = JSON.parse(readFileSync("./webman.config.json", {encoding: 'utf8'}));
} catch(err) {
    console.error('ERROR: No config file detected');
    config = {
        port: 3000,
        dbURL: "mongodb://localhost:27017/"
    }
}

const app = express();
app.listen(config.port);


const client = new mongo.MongoClient(config.dbURL);
client.connect();
const auth = client.db('webman_auth').collection('auth')

app.route('/auth')
    .get((req, res) => {
        createReadStream(join(__dirname, "../public/pages/auth.html"), {encoding: "utf8"})
            .on('data', (data) => {
                res.send(data);
            });
    })
    .post((req, res) => {
        auth.findOne({user: req.query.u, pass: req.query.p});
        // res.send('Send login details\n' + `Username: ${req.query.u} Password: ${req.query.p}`);
    })