import * as mongo from "mongodb";
import express from "express";
import cookieParser from "cookie-parser";
import * as bcrypt from "bcrypt";
import { readFileSync, createReadStream } from "fs";
import { join } from "path"
import multer from "multer";


interface config {
    port: number,
    dbURL: string
}

interface user {
    user: string,
    pass: string
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
const upload = multer();
    
app.use(cookieParser());

app.listen(config.port);
console.log("Webman is running on port " + config.port);

const client = new mongo.MongoClient(config.dbURL);
client.connect();
console.log("Connected to MongoDB instance at " + config.dbURL);
const auth = client.db('webman').collection('auth_keys');
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
        console.log("Auth details", req.body);
        if (!req.body) {
            res.send("Rejected");
            return;
        }
        var authMatch = await (await auth.find({user: req.body.user})).toArray();
        console.log("Match: ", authMatch);
        if (authMatch.length == 0) {
            res.send("Rejected");
            return;
        }
        authMatch.forEach((match) => {
            if (bcrypt.compareSync(req.body.pass, match.pass)) {
                res.send("Passed");
                return;
            } else {
                res.send("Rejected");
                return;
            };
        });
    });