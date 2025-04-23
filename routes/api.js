/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const { response } = require("../server");

module.exports = function (app, myDataBase) {
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(function (req, res) {
      try {
        let title = req.body.title;
        console.log("Title:", title);
        let response = { title: "hoiii" };

        res.json(response);
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
    .get(function (req, res) {
      try {
      } catch (e) {}

      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      try {
      } catch (e) {}

      //json res format same as .get
    })

    .delete(function (req, res) {
      try {
      } catch (e) {}

      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });

  app.use(function (req, res, next) {
    res.status(400).type("text").send("Not Found");
  });
};
