const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let usersWithSameName = users.filter((user) => {
        user.username === username;
    });

    if (usersWithSameName.length > 0) {
        return true;
    } else {
        return false;
    }
};

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.params.username;
  const password = req.params.password;

  if (username && password) {
    if (!doesExist(username)) {
        users.push({"username":username, "password":password});
        return res.status(200).json({ message: "User is now registered, and can now login."})
    } else {
        return res.status(404).json({ message: "User already exists!"})
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; 

  if (books[isbn]) {
    return res.status(200).send(books[isbn]);
  } else {
    return res.status(404).json({ message: "No book found with that ISBN."})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let result = [];

  Object.keys(books).forEach(isbn => {
    if (author === books[isbn].author) {
        result.push(books[isbn]);
    }
  });

  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "No books found by this author."});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let result = [];

  Object.keys(books).forEach(isbn => {
    if (title === books[isbn].title) {
        result.push(books[isbn]);
    }
  });

  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "No books found with this title."});
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].review)
  } else {
    return res.status(404).json({ message: "No book found with that ISBN."})
  }
});

module.exports.general = public_users;
