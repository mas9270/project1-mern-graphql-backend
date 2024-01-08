const express = require("express")
require("dotenv").config()
const cors = require('cors');
const { graphqlHTTP } = require("express-graphql")
const port = process.env.PORT || 5000
const app = express()
const schema = require('./schema');
const connectDB = require('./database');

app.use(cors())

// set schema
app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
}))


//run db
connectDB()
    .then(() => console.log(`connected to db`))
    .catch((e) => console.log(err))


//app start
app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})