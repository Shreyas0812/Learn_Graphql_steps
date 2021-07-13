 //Books and Author example.... we use dummy data, and a new schema ofc
//Here we'll see how to add data to addresses, same way as we did for books in the last one
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

const RootMutationType = new GraphQLObjectType({   
    name: "Mutation",
    description: 'Root Mutation',
    fields: () => ({ 
        addBook: {  
            type: BookType,
            description: 'Add a Book',
            args: { 
                name: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => { 
                const book = { 
                    id: books.length +1, 
                    name: args.name,
                    authorId: args.authorId  
                }
                
                books.push(book) 
                return book 
            }         
        },
        addAuthor: {             //same as the book
            type: AuthorType,    //single author added
            description: 'Add an Author',
            args: {                                            
                name: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => { 
                const author = { 
                    id: authors.length +1,  //automatically setting it to the next index
                    name: args.name,
                }
                
                authors.push(author)   //adding to the list 
                return author      //returning the author
            }         
        }
    }) 
})

const schema = new GraphQLSchema ({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', expressGraphQL ({
    schema: schema, 
    graphiql: true  
}))

app.listen(5000, () => console.log('Server is running')) 

/*
mutation {
  addAuthor(name: "Charles Dickens") {
    id
    name
  }
}
}
*/

//and after this

/*
query {
    authors {
        id
        name
    }
*/

//and

/*
query {
  authors{
    id
    name
    books{
      name
    }
  }
}
*/

//as last author doesn't have any book, it'll show an empty array

//We can also work on update..... but in the database, we can change the data, similar to add function

// In graphql we query exacctly the data we want to query
//DONE!!!.... Just gonna save the code in other file