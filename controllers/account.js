const { MongoClient, ObjectId } = require("mongodb");
const fs = require("node:fs"); // i dont need require('fs') or path, let's use nodes
const uri = "mongodb://127.0.0.1:27017";
// Create new instanceif
if (!fs.existsSync("./db")) {fs.mkdirSync("./db")};

const client = new MongoClient(uri,{ useUnifiedTopology: true });
async function conn() {
    await client.connect();
}
conn();
const database = client.db("login");
const accs = database.collection("accounts");
const myfil = {
    _id: new ObjectId('63b6441832087ccc7e3edea2')
};

const users = accs.findOne(myfil);
const path = require("node:path");
const bcrypt = require('bcrypt');
const env = process.env;
var saltRounds = 10;


const AddSet = class AddSet {
    constructor(user,pass) {
        console.log(pass);
        this.set = {[user]:pass};
        this.set = Object.keys(this.set).reduce((acc, key) => {
            acc[key.toString()] = this.set[key];
            return acc;
        }, {});
        console.log(this.set);
        return this.set;
    }
}

const Account = class Account {
    constructor(user,password) {
        if (!users[user]) {
            var okPass;
            conn();

            okPass = bcrypt.hash(password, saltRounds, function(err, hash) {try {var a = ""+user; return new AddSet(a.toString(),hash);} catch(err) {console.error(err)}});
            console.log(this.addSet);
            console.log(okPass);
            accs.updateOne(myfil,okPass);
            this.assetDir = path.join(path.join(env.SAVED_FOLDER,"/"+this.user),"/assets");
            this.metaDir = this.assetDir + '/meta';
            this.starterDir = path.join(path.join(env.SAVED_FOLDER,"/"+this.user),"/starters");
            this.videoDir = path.join(path.join(env.SAVED_FOLDER,"/"+this.user),"/videos");
            var fs = require('fs');

            if (!fs.existsSync(this.assetDir)) fs.mkdirSync(this.assetDir, { recursive: true });
            if (!fs.existsSync(this.starterDir)) fs.mkdirSync(this.assetDir, { recursive: true });
            if (!fs.existsSync(this.videoDir)) fs.mkdirSync(this.assetDir, { recursive: true });

        }

    }
    getAssetDir() {
        // should return something like _SAVED/(username)/assets
        return this.assetDir;
    }
    getStarterDir() {
        return this.starterDir;
    }
    getVideoDir() {
        return this.videoDir;
    }
    getMetaDir() {
        return this.metaDir;
    }
    checkSession(pswd) {
        conn();
        bcrypt.compare(pswd, users[this.user], function(err, result) {  // Compare
            // if passwords match
            if (result) return true;
            // if passwords don't match
            else return false;
        });
    }
}
module.exports = { Account, users };