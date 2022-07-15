const { UserWallet} = require("@elrondnetwork/erdjs-walletcore");
const { UserSigner } = require("@elrondnetwork/erdjs-walletcore/out/userSigner");
const {Transaction, BytesValue,ContractFunction,GasLimit,TransactionPayload,Address, Account} = require("@elrondnetwork/erdjs");
const { ProxyNetworkProvider}= require ("@elrondnetwork/erdjs-network-providers");

const networkProvider = new ProxyNetworkProvider("https://devnet-gateway.elrond.com");
const CONTRACT_ADDRESS="erd1qqqqqqqqqqqqqpgq0pahcf33c0u05uqpk679t7lmqk273slgfuuqy33lec";

const GAS_MULTIPLIER=35


export const prepareTransaction =   async (keyStore,password,method,data) => {
    let secretKey= UserWallet.decryptSecretKey(keyStore,password);
    let addressOfVehick=secretKey.generatePublicKey().toAddress()
    let vehick= new Account(addressOfVehick)
    let addressOnNetwork=await networkProvider.getAccount(addressOfVehick)
    let networkConfig= await networkProvider.getNetworkConfig()
    vehick.update(addressOnNetwork)
    const signer=new UserSigner(secretKey)

 
    const vinTransactionPayload = TransactionPayload.contractCall()
      .setFunction(new ContractFunction(method))
      .setArgs([BytesValue.fromUTF8(String(data))])
      .build();

      const estimatedGasLimit = 
        networkConfig.MinGasLimit+
        networkConfig.GasPerDataByte * vinTransactionPayload.toString().length * GAS_MULTIPLIER
        
    const transaction = new Transaction({
        data: vinTransactionPayload,
        gasLimit: estimatedGasLimit,
        receiver: new Address(CONTRACT_ADDRESS),
        value: 0,
        chainID: networkConfig.ChainID
    });
    transaction.setNonce(vehick.getNonceThenIncrement());
    signer.sign(transaction);
    let txHash= await networkProvider.sendTransaction(transaction);
    console.log(`Tx Hash: ${txHash}`)
}





