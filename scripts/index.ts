import * as mongo from "mongodb";
import express from "express";
import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as bcrypt from "bcrypt";
import { readFileSync, createReadStream } from "fs";
import { join } from "path"


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

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.listen(config.port);
console.log("Webman is running on port " + config.port)


const client = new mongo.MongoClient(config.dbURL);
client.connect();
const auth = client.db('webman_auth').collection('auth_keys');
auth.insertOne({user: "test_account", pass: "test123"});

app.route('/auth')
    .get((req, res) => {
        createReadStream(join(__dirname, "../public/pages/auth.html"), {encoding: "utf8"})
            .on('data', (data) => {
                res.send(data);
            });
    })
    .post(async (req, res) => {
        console.log(req.body)
        var authDetails = {
            user: req.body.user,
            pass: bcrypt.hashSync(req.body.pass, 12)
        }
        console.log("Auth details\n" + authDetails);
        var authMatch = await auth.findOne(authDetails);
        console.log("MATHC:\n" + authMatch);
    })