"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo = __importStar(require("mongodb"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const bcrypt = __importStar(require("bcrypt"));
const fs_1 = require("fs");
const path_1 = require("path");
const multer_1 = __importDefault(require("multer"));
var config;
try {
    config = JSON.parse((0, fs_1.readFileSync)("./webman.config.json", { encoding: 'utf8' }));
}
catch (err) {
    console.error('ERROR: No config file detected');
    config = {
        port: 3000,
        dbURL: "mongodb://localhost:27017/"
    };
}
const app = (0, express_1.default)();
const upload = (0, multer_1.default)();
app.use((0, cookie_parser_1.default)());
app.listen(config.port);
console.log("Webman is running on port " + config.port);
const client = new mongo.MongoClient(config.dbURL);
client.connect();
console.log("Connected to MongoDB instance at " + config.dbURL);
const auth = client.db('webman').collection('auth_keys');
app.route('/auth')
    .get((req, res) => {
    (0, fs_1.createReadStream)((0, path_1.join)(__dirname, "../public/pages/auth.html"), { encoding: "utf8" })
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
    var authMatch = await (await auth.find({ user: req.body.user })).toArray();
    console.log("Match: ", authMatch);
    if (authMatch.length == 0) {
        res.send("Rejected");
        return;
    }
    authMatch.forEach((match) => {
        if (bcrypt.compareSync(req.body.pass, match.pass)) {
            res.send("Passed");
            return;
        }
        else {
            res.send("Rejected");
            return;
        }
        ;
    });
});
//# sourceMappingURL=index.js.map