const { createSchema } = require('graphql-yoga')
const fs = require('fs')
const path = require('path')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')

const schema = createSchema({
    typeDefs: fs.readFileSync(path.join(__dirname, 'def.graphql'), 'utf8'),
    resolvers: {
      Query,
      Mutation,
    },
  })
  
  module.exports = schema

