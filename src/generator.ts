import * as core from '@elrondnetwork/elrond-core-js'
import * as fs from 'fs'
import * as securePassword from 'secure-random-password'
import * as data from "../data.json"


export const generator = () =>{
let password=securePassword.randomPassword({length:13})
let account = new core.account()
let mnemonic = account.generateMnemonic()
let accountIndex = 0;
let privateKeyHex = account.privateKeyFromMnemonic(mnemonic, false, accountIndex.toString(), "");
let privateKey = Buffer.from(privateKeyHex, "hex");
let keyFileObject = account.generateKeyFileFromPrivateKey(privateKey, password);
let keyFileJson = JSON.stringify(keyFileObject, null, 4);

fs.writeFileSync(`./wallet/${data.vin}.json`, keyFileJson);
fs.writeFileSync(".env",`pass="${password}"`)

}
