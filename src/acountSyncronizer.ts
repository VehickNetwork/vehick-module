import { UserWallet } from '@elrondnetwork/erdjs-walletcore'
import { UserSigner } from '@elrondnetwork/erdjs-walletcore/out/userSigner'
import { Account } from '@elrondnetwork/erdjs'
import { networkProvider } from './providers'

export const accountSyncronizer = async (keyStore, password) => {
    let secretKey = UserWallet.decryptSecretKey(keyStore, password)
    let addressOfVehick = secretKey.generatePublicKey().toAddress()
    let vehick = new Account(addressOfVehick)
    let addressOnNetwork = await networkProvider.getAccount(addressOfVehick)
    vehick.update(addressOnNetwork)
    const signer = new UserSigner(secretKey)
    return { account: vehick, signer: signer }
}
