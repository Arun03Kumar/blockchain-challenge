const blockchain = require('../utils/interact')
const Query = {
    getName(parent, args, ctx, info) {
        const name = blockchain.name()
        return name
    },

    getBalance(parent, args, ctx, info) {
        const bal = blockchain.balance(args.address)
        return bal
    },
    
    getTotalSupply(parent, args, ctx, info) {
        const res = blockchain.totalSupp()
        return res
    }
}

module.exports = Query