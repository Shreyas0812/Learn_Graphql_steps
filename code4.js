//Boks and Author example.... we use dummy data, and a new schema ofc
const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP

const {
    GrahQLSchema, 
    GraphQLObjectType, 
    GraphQLSchema,
    GraphQLString,
    GraphQLList
} = require('graphql')

app = express() 

//Let's get some dummy data here, ofc in actual application we'll have a database and everything
const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]


//We're gonna create a root quer scope, essentially it's a root query that everything is gonna pull down from, one place to define all the objects
const RootQueryType = new GraphQLObjectType ({
    name: 'Query',
    description: 'Root Query', //optional, for us to see in the documentaion inside graphiql
    fields: () => ({
        books: {
            type: new GraphQLList(BookType), //We'll create this as well,this is a custom graphql object type that you're gonna define 
            description: 'List of Books',
            resolve:() => books   //we're returning a list of book types
        }
    }) //By adding a function in paranthesis, so we don't have to write a return statement, since this will return eerything inside
})
app.use('/graphql', expressGraphQL ({
    schema: schema, //pass the schema defined on line 18
    graphiql: true  
}))

app.listen(5000, () => console.log('Server is running')) 


//This code is incomplete, we need to define out ustom Book Type... next file