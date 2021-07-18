 //Bo0ks and Author example.... we use dummy data, and a new schema ofc
//Now we just add the books field to authors, so that we can see which books the author has written
const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP

const {
    GraphQLObjectType, 
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLInt,  
    GraphQLNonNull, 
    GraphQLBoolean
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
        books: {type: GraphQLList(BookType),        //New field to show the books written by the author
            resolve: (author) => {            // Here Author is the parent 
                return books.filter(book => book.authorId === author.id)   //filtering to get only what we want from that list
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
        }
    }) 
})

const schema = new GraphQLSchema ({
    query: RootQueryType
})

app.use('/graphql', expressGraphQL ({
    schema: schema, 
    graphiql: true  
}))

app.listen(5000, () => console.log('Server is running')) 

/*
query {
  authors {
    name,
    books {
      name
    }
  }
}
*/

//Query the above to see

//One single query we're running here
//In REST API, this would require, one query for author, another one for books for author 1, author 2 and author 3, total 4 queries, plus it'll return us information such as id and authorid of the book, which we don't actually want

//What if we want books for only one author, rather than all of them as a list, we can do that.... next code