const express = require('express')
const cors = require('cors')
const { createYoga } = require('graphql-yoga')
const schema = require('./schema')

const app = express()
app.use(cors())
const yoga = createYoga({
    schema,
    graphiql: true
})
app.use('/graphql', yoga)

app.listen(3000, () => {
    console.log("server running on port 5000")
})