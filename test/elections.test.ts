const assert = require('assert')
const ganache = require('ganache-cli')

const Web3 = require('web3')

const web3 = new Web3(ganache.provider({ gasLimit: 1000000000000 }));

const compiledElection = require("../src/build/Election.json")

let election
let accounts

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()
    election = await new web3.eth.Contract(JSON.parse(compiledElection.interface))
        .deploy({ data: compiledElection.bytecode })
        .send({ from: accounts[0], gas: '100000000' })
})

describe("Election", () => {
    it("deploys election contract", () => {
        assert.ok(election.options.address)
    })

    it("manager deploys election", async () => {
        const manager = await election.methods.manager().call()
        assert(manager === accounts[0])
    })

    it("participate in election & can not participate twice", async () => {
        await election.methods.participate("Narendra Modi").send({
            from: accounts[0],
            gas: '1000000'
        })
        try {
            await election.methods.participate("Narendra Modi").send({
                from: accounts[0],
                gas: '1000000'
            })
            assert(false)
        } catch (error) {
            assert(error)
        }
    })

    it("cast vote", async() => {
        await election.methods.participate("Narendra Modi").send({
            from: accounts[0],
            gas: '1000000'
        })

        await election.methods.castVote(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        let candidateData = await election.methods.candidates(0).call()
        assert(candidateData["voteCount"] == 1)
    })

    it("cannot cast vote twice", async() => {
        await election.methods.participate("Narendra Modi").send({
            from: accounts[0],
            gas: '1000000'
        })

        await election.methods.castVote(0).send({
            from: accounts[0],
            gas: '1000000'
        })
        try {
            await election.methods.castVote(0).send({
                from: accounts[0],
                gas: '1000000'
            })
        } catch (error) {
            assert(error)
        }
        // assert(votersData[accounts[0]])
    })
})