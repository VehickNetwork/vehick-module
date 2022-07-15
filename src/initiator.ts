import * as fs from 'fs'
import * as data from "../data.json"
import { generator } from './generator'
import * as dotenv from 'dotenv'
import { prepareTransaction } from './prepareTransaction';

const keyStore=require('../wallet/modulevehickjs.json')

dotenv.config()
let files = fs.readdirSync('./wallet')
let password=process.env.PASS
const keyStoreName=`${data.vin}.json`






export const initiator = () => {
    if(!files.includes(keyStoreName)){
        console.log("Wallet doesn't exist\n Creating one!")
        generator()
    }
    prepareTransaction(keyStore,password,'addVIN',data.vin);


}


initiator()


