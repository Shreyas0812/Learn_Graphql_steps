//First thing to do is set up a very basic express server
//What is express --> It's a framework, a library, which allows you to use some functions

const express = require('express')
app = express() //get app part of express
app.listen(5000, () => console.log('Server is running')) //2nd function to see if the server is running