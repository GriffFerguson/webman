import * as mongo from "mongodb";
import { compareSync } from "bcrypt";

var status = "N/A"

export async function authenticate(user: User, dbURL: string): Promise<string> {
    // console.log("Auth function")
    const client = new mongo.MongoClient(dbURL);
    client.connect();
    const authDB = client.db('webman').collection('auth_keys');
    // console.log("DB connected")
    
    var authMatch = await (await authDB.find({user: user.user})).toArray();
    // console.log("Match", authMatch)
    client.close();

    // console.log("Loop")
    if (authMatch.length === 0) {
        status = "Fail";
    }
    authMatch.forEach((match) => {
        if (compareSync(user.pass, match.pass)) {
            status = "Pass";
        } else {
            status = "Fail";
        };
    });
    // console.log(status);
    return status;

}

// export const authStates = {
//     failed: 
// }