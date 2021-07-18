//we'll work on adding graphql  to our server, we'll require some stuff

const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
app = express() 

//adding a route for our application
app.use('/graphql', expressGraphQL ({
    graphiql: true  //gives us an actual grpahql menu on the GUI, without having to manually call something like POSTMAN
}))
app.listen(5000, () => console.log('Server is running')) 

//Now what is postman, we're only working on server side na, soo this POSTMAN thigy will act as a dummy frontend, and send us the data that we need, not important here, although pretty important while doing the REST API, just saves our time by not making us do the frontend ka part as well

// This code will throw an error:
// "GraphQL middleware options must contain a schema."
// Soo based on the query we get the results right, 
// So the way that graphQL knows which data to access based on the query you send is that you have to defina schema of how all you data interacts together.

//We pass this 'Schema' in the expressGraphQL function, so it knows how the data looks like