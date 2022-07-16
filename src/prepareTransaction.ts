import {
    Transaction,
    BytesValue,
    ContractFunction,
    TransactionPayload,
    Address,
} from '@elrondnetwork/erdjs'
import { CONTRACT_ADDRESS } from './constants'
import { networkProvider } from './providers'

const GAS_MULTIPLIER = 60

export const prepareTransaction = async (action, data) => {
    let networkConfig = await networkProvider.getNetworkConfig()

    const transactionPayload = TransactionPayload.contractCall()
        .setFunction(new ContractFunction(action))
        .setArgs([BytesValue.fromUTF8(String(data))])
        .build()

    const estimatedGasLimit =
        networkConfig.MinGasLimit +
        networkConfig.GasPerDataByte *
            transactionPayload.toString().length *
            GAS_MULTIPLIER

    const transaction = new Transaction({
        data: transactionPayload,
        gasLimit: estimatedGasLimit,
        receiver: new Address(CONTRACT_ADDRESS),
        value: 0,
        chainID: networkConfig.ChainID,
    })

    return transaction
}
