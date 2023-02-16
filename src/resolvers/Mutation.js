const blockchain = require("../utils/interact");

const Mutation = {
  mintToken(parent, args, ctx, info) {
    const res = blockchain.mint(args.tokenId, args.uri);
    return res;
  },
  listNFT(parent, args, ctx, info) {
    const res = blockchain.listToMarket(args.tokenId);
    return res;
  },
  cancelNFT(parent, args, ctx, info) {
    const res = blockchain.removeFromMarket(args.tokenId);
    return res;
  },
  buy(parent, args, ctx, info) {
    const res = blockchain.buy(args.tokenId);
    return res;
  },
};

module.exports = Mutation;
