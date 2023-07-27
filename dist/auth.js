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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const mongo = __importStar(require("mongodb"));
const bcrypt_1 = require("bcrypt");
var status = "N/A";
async function authenticate(user, dbURL) {
    const client = new mongo.MongoClient(dbURL);
    client.connect();
    const authDB = client.db('webman').collection('auth_keys');
    var authMatch = await (await authDB.find({ user: user.user })).toArray();
    client.close();
    if (authMatch.length === 0) {
        status = "Fail";
    }
    authMatch.forEach((match) => {
        if ((0, bcrypt_1.compareSync)(user.pass, match.pass)) {
            status = "Pass";
        }
        else {
            status = "Fail";
        }
        ;
    });
    return status;
}
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map