"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
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
app.listen(config.port);
app.route('/auth')
    .get((req, res) => {
    (0, fs_1.createReadStream)((0, path_1.join)(__dirname, "../public/pages/auth.html"), { encoding: "utf8" })
        .on('data', (data) => {
        res.send(data);
    });
})
    .post((req, res) => {
    res.send('Send login details\n' + `Username: ${req.query.u} Password: ${req.query.p}`);
});
