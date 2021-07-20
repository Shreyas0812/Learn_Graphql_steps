//using fetch
const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const fetch = require("node-fetch");

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
        addAuthor: {           
            type: AuthorType,    
            description: 'Add an Author',
            args: {                                            
                name: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => { 
                const author = { 
                    id: authors.length +1,  
                    name: args.name,
                }
                
                authors.push(author)   
                return author      
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
    //graphiql: true  
}))

fetch('http://localhost:5000/graphql', {   //fetch data to see 
    method: 'POST',                        //method, we need to post to the graphql api to get some result right, this will be analysed in ".then" ahead
    headers: {"Content-Type":"application/json"}, //not compulsary to put it, this is just because we know the content type, might be useful later
    body: JSON.stringify({   //This is the main body, JSON.stringify converts a JavaScirpt Object or value to a JSON string.... there are other parameters... see documentation, not used here
        query:`            
            query {
                authors{
                id
                name
                books{
                    name
                }
                }
            }
        `                     //The entire query that needs to be put on the website, needs to be put under 'query' variable
    })
})
.then(res => res.json())         //The result of last function is put in the first argument, here res.........res.json() converts the string to proper json format to be used
.then(data => {                  // this json is put in data, aand is printed in console .log, first data is orange which is used, inside it, everything is stored in one key value pair, main key is called 'data' again
    console.log(data.data)
    console.log(data.data.authors)   //printing what is inside data kay... inside that authors key... this is a list

    //using this array with forEach
    data.data.authors.forEach(element => {  //using forEach to loop through each element, again key-value logic
        console.log(element.name)
        console.log(element.books)
    });
})
app.listen(5000, () => console.log('Server is running')) 