const { ObjectId } = require("mongodb");

class BookController {
  async logBook(req) {
    //console.log("reqbody", req.body);
    if (req.body.title) {
      const db = req.app.locals.myDataBase;
      const insertObj = await db.insertOne({
        title: req.body.title,
        commentcount: 0,
      });
      // console.log(insertObj);
      const book = await db.findOne({ _id: insertObj.insertedId });
      // console.log("book", book);
      return book;
    } else {
      return "missing required field title";
    }
  }

  async getAllBooks(req) {
    let db = req.app.locals.myDataBase;
    let listOfBooks = await db.find().toArray();

    listOfBooks.forEach((book) => {
      this.populateBookObj(book);
    });
    console.log("listOfBooks", listOfBooks);

    return listOfBooks;
  }

  async findBookAndAction(action, load) {
    try {
      let book = await action(...load);
      // console.log("BOOK", book);
      if (!book) {
        return "no book exists";
      } else {
        return book;
      }
    } catch (err) {
      console.log("ERROR:", err);
      return "no book exists";
    }
  }

  async commentOnBook(req) {
    let result;
    let bookId = req.params.id;
    let db = req.app.locals.myDataBase;
    let comment = req.body.comment;

    if (!comment) {
      result = "missing required field comment";
    } else {
      try {
        result = await this.findBookAndAction(db.findOneAndUpdate.bind(db), [
          { _id: new ObjectId(bookId) },
          { $push: { comments: comment }, $inc: { commentcount: 1 } },
          { returnDocument: "after" },
        ]);
      } catch (error) {
        console.log("ERROR", error);
      }
    }
    return result;
  }

  populateBookObj(book) {
    if (typeof book === "object" && !book.comments) {
      book.comments = [];
    }
    //  console.log("BOOK:", book);

    return book;
  }
  async getBookById(req) {
    let db = req.app.locals.myDataBase;

    let result = await this.findBookAndAction(db.findOne.bind(db), [
      { _id: new ObjectId(req.params.id) },
    ]);

    result = this.populateBookObj(result);
    return result;
  }

  async deleteAllBooks(req) {
    let db = req.app.locals.myDataBase;
    try {
      await db.deleteMany({});
    } catch (error) {
      return `couldn't delete books: ${error}`;
    }
    return "complete delete successful";
  }

  async deleteBook(req) {
    let db = req.app.locals.myDataBase;
    let bookId = req.params.id;
    let result = await this.findBookAndAction(db.findOneAndDelete.bind(db), [
      { _id: new ObjectId(bookId) },
    ]);

    if (typeof result === "object") {
      result = "delete successful";
    }
    return result;
  }
}

module.exports = new BookController();
