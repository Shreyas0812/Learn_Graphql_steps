 //Books and Author example.... we use dummy data, and a new schema ofc
//Lets work on modifying the data, which is what we use mutaions for
//mutations are graphql's version of using 'POST', 'PUT' and 'DELETE' for an equivalent REST API
//Here we'll see how to add data
const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP

const {
    GrahQLSchema, 
    GraphQLObjectType, 
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLInt,  
    GraphQLNonNull, 
    GraphQLBoolean,
    GraphQLScalarType
} = require('graphql')

app = express() 

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

const BookType = new GraphQLObjectType ({
    name: 'Book',
    description: 'This Represents a book written by an author',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)}, 
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType, 
            resolve: (book) => { 
                return authors.find(author => author.id === book.authorId)
            }
        } 
    })
})

const AuthorType = new GraphQLObjectType ({
    name: 'Author',
    description: 'This Represents an author of a book',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)}, 
        name: {type: GraphQLNonNull(GraphQLString)},
        books: {type: GraphQLList(BookType),      
            resolve: (author) => {            
                return books.filter(book => book.authorId === author.id) 
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType ({
    name: 'Query',
    description: 'Root Query', 
    fields: () => ({
        books: {
            type: new GraphQLList(BookType), 
            description: 'List of Books',
            resolve:() => books   
        },
        authors: {                            
            type: new GraphQLList(AuthorType), 
            description: 'List of all Authors',
            resolve:() => authors   
        },
        book: { 
            type: BookType,              
            description: 'A single book',
            args: {
                id: {type: GraphQLInt}
            },
            resolve:(parent, args) => books.find(book => book.id === args.id)   
        },
        author: {                            
            type: AuthorType, 
            description: 'A single author',
            args: { 
                id: {type: GraphQLInt}
            },
            resolve:(parent, args) => authors.find(author => author.id === args.id)   
        }
    }) 
})

const RootMutationType = new GraphQLObjectType({   // defines the thing we're gonna use in schema for mutaions
    name: "Mutation",
    description: 'Root Mutation',
    fields: () => ({ //here fields are essentially the different operations that we want to do
        addBook: {  //adding a book to the database
            type: BookType,
            description: 'Add a Book',
            args: {       //we need data to pass to the server to add a book, in our case we only need 2 parametes
                name: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => { //To add data to our list
                const book = { 
                    id: books.length +1, //id is next index, If a database is used, this will be automatically generatede
                    name: args.name,
                    authorId: args.authorId  
                }
                
                books.push(book) //adding the book to the books array
                return book // we're returning the book object
            }         
        }
    }) 
})

const schema = new GraphQLSchema ({
    query: RootQueryType,
    mutation: RootMutationType//new object ttype for mutations, 
})

app.use('/graphql', expressGraphQL ({
    schema: schema, 
    graphiql: true  
}))

app.listen(5000, () => console.log('Server is running')) 

/*
mutation {
  addBook(name: "Tale of two cities", authorId: 12) {
    id
  }
}
*/

//and after this
/*
query {
    id
    name
}
*/

//you can see the new name being added, it goes away when you restart the server, bcuz not an actual database