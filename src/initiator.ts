import * as fs from 'fs'
import * as data from '../data.json'
import { generator } from './generator'
import * as dotenv from 'dotenv'
import { prepareTransaction } from './prepareTransaction'
import { networkProvider } from './providers'
import {
    ACTION_ADD_MEASURE_UNIT,
    ACTION_ADD_VIN,
    MEASURE_UNIT_KILOMETERS,
} from './constants'
import { accountSyncronizer } from './acountSyncronizer'

const keyStoreName = `${data.vin}.json`

export const initiator = async () => {
    let files = fs.readdirSync('./wallet')
    if (!files.includes(keyStoreName)) {
        console.log("Wallet doesn't exist\n Creating one!")
        generator()
    }
    dotenv.config()
    const keyStore = require(`../wallet/${keyStoreName}`)
    let password = process.env.PASS

    const vehickSyncronized = await accountSyncronizer(keyStore, password)

    const bulkTransactions = [
        {
            action: ACTION_ADD_VIN,
            data: data.vin,
        },
        {
            action: ACTION_ADD_MEASURE_UNIT,
            data: MEASURE_UNIT_KILOMETERS,
        },
    ]

    bulkTransactions.forEach(async (bulkTransaction) => {
        console.log(bulkTransaction)
        let tx = await prepareTransaction(
            bulkTransaction.action,
            bulkTransaction.data
        )
        tx.setNonce(vehickSyncronized.account.getNonceThenIncrement())
        vehickSyncronized.signer.sign(tx)
        let txHash = await networkProvider.sendTransaction(tx)
        console.log(`Tx Hash: ${txHash}`)
    })
}

initiator()
