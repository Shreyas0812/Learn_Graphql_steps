//we'll work on adding graphql  to our server, we'll wrequire some stuff

const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP

//to create a schema,we might need a few diff things from the Graphql library
const {
    GrahQLSchema, //Importing Schema
    GraphQLObjectType, //In GraphQl everthins is strongly types, so an objecttype allows you to create a dynamic object full of different other types.Compare it to Structures in C
    GraphQLSchema,
    GraphQLString //For strings in graphql
} = require('graphql')

app = express() 

//Let's create a new Schema, kind of like normal sql we need a schema then we can put data and all na. For now let's create a dummy schema

const schema = new GraphQLSchema ({   //Line 10 se
    //actual Schema here
    query: new GraphQLObjectType ({  // Query section is essentially getting of data...... now this new GraphQLObject Type is like struct in cpp, instead of int or string directly, we're using a combination of those for each entry
        name: "HelloWorld",
        fields: () => ({//Fields that "HelloWorld" returns, you can't have spaces here, HelloWorld is correct, Hello World is not....................These are all the different sections of the objects, which can qe queried to return data from 
            //So inside this function, we actually return the different fields that we want to return, in this case, just a message
            message: {type: GraphQLString,  //This message is actually our objecct, which defines type of our message, remember this is schema, you don't put words or numbers inside...... GraphQLString is the data type
            resolve: () => "Hello World" //This is where you tell graphQl where to get this message and the text whatever you wanna put from........................ What actual information is returned.... It comes with different arguments such as resolve: (parents, args) => "Hello World", parent that it's being called from, args is something we can pass to our query... not important in this simple example... They are often resoleved to specific types if need be, eg. if object returns json, resolve will automatically default to it....it's not necessary ot call resolve here, because we already called a message attribute of that object.
            }
        })        
    })                  
})

app.use('/graphql', expressGraphQL ({
    schema: schema, //pass the schema defined on line 18
    graphiql: true  
}))

app.listen(5000, () => console.log('Server is running')) 


//Finally when you run this

/*
query {
  message
}
*/

//Query this