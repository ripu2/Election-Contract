const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')

const Election = require('../src/build/Election.json')

const provider = new HDWalletProvider(
    'zero idle knock obtain science cotton equal soon maid shy couple ability',
    'https://rinkeby.infura.io/v3/16d5d06c796f4d94aaa9bb8e5a93fa74'
)

const web3 = new Web3(provider)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('accounts', accounts)
    if (accounts) {
        console.log('Attempting to deploy form =====>', accounts[0], '🚀')

        try {
            const res = await new web3.eth.Contract(JSON.parse(Election.interface))
            .deploy({ data: Election.bytecode })
            .send({ gas: '10000000', from: accounts[0] })

        if (res) {
            console.log('interface ====>', Election.interface)
            console.log('Contract deployed at ===>', res.options.address, '🔥');
            provider.engine.stop()
        }
        } catch (error) {
            console.log('errr =====>', error)
        }
    } else {
        console.log('failed to deploy contract ☹️')
    }
}
deploy()