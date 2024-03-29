import * as mongo from "mongodb";
import express from "express";
import cookieParser from "cookie-parser";
import * as bcrypt from "bcrypt";
import { readFileSync, createReadStream } from "fs";
import { join } from "path"
import multer from "multer";
import * as auth from "./auth.js";

var config: Config;

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
const upload = multer();
    
app.use(cookieParser());

app.listen(config.port);
console.log("Webman is running on port " + config.port);

const client = new mongo.MongoClient(config.dbURL);
client.connect();
console.log("Connected to MongoDB instance at " + config.dbURL);
const authDB = client.db('webman').collection('auth_keys');
// auth.insertOne({user: "test_account", pass: bcrypt.hashSync("test123", 17)});

// AUTH
app.route('/auth')
    .get((req, res) => {
        createReadStream(join(__dirname, "../public/pages/auth.html"), {encoding: "utf8"})
            .on('data', (data) => {
                res.send(data);
            });
    })
    .post(upload.none(), async (req, res) => {
        // res.setHeader("Content-Type", "text/plain");
        console.log("Auth details", req.body);
        if (!req.body) {
            res.send("Rejected");
            return;
        }
        var match = await auth.authenticate(req.body, config.dbURL);
        console.log("Match", match);
        res.send(match);
        res.end();
    });
