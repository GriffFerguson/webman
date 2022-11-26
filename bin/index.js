"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo = __importStar(require("mongodb"));
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const bcrypt = __importStar(require("bcrypt"));
const fs_1 = require("fs");
const path_1 = require("path");
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.listen(config.port);
console.log("Webman is running on port " + config.port);
const client = new mongo.MongoClient(config.dbURL);
client.connect();
const auth = client.db('webman_auth').collection('auth_keys');
auth.insertOne({ user: "test_account", pass: "test123" });
app.route('/auth')
    .get((req, res) => {
    (0, fs_1.createReadStream)((0, path_1.join)(__dirname, "../public/pages/auth.html"), { encoding: "utf8" })
        .on('data', (data) => {
        res.send(data);
    });
})
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    var authDetails = {
        user: req.body.user,
        pass: bcrypt.hashSync(req.body.pass, 12)
    };
    console.log("Auth details\n" + authDetails);
    var authMatch = yield auth.findOne(authDetails);
    console.log("MATHC:\n" + authMatch);
}));
