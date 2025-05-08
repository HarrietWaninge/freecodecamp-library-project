/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const { response } = require("../server");
const BookController = require("./../controllers/bookController.js");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      const allBooks = await BookController.getAllBooks(req);
      // console.log("allbooks", allBooks);
      res.json(allBooks);
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      try {
        let title = req.body.title;
        //console.log("Title:", title);
        let response = await BookController.logBook(req);
        // console.log("resp", response);
        res.json(response); //;
      } catch (e) {
        console.error(e);
      }

      //response will contain new book object including atleast _id and title
    })

    .delete(function (req, res) {
      try {
      } catch (e) {}
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookId = req.params.id;
      // console.log("bookid", bookId);
      let response = await BookController.getBookById(req);
      // console.log("resp", response);
      res.json(response);
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async function (req, res) {
      let book;
      try {
        book = await BookController.commentOnBook(req);
      } catch (e) {}

      res.json(book);
      //json res format same as .get
    })

    .delete(async function (req, res) {
      let result;
      try {
        result = await BookController.deleteBook(req);
      } catch (e) {}
      res.json(result);

      //if successful response will be 'delete successful'
    });

  app.use(function (req, res, next) {
    res.status(400).type("text").send("Not Found");
  });
};
