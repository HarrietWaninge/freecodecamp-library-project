const { ObjectId } = require("mongodb");

class BookController {
  async logBook(req) {
    //console.log("reqbody", req.body);
    if (req.body.title) {
      const db = req.app.locals.myDataBase;
      const insertObj = await db.insertOne({
        title: req.body.title,
        commentCount: 0,
      });
      // console.log(insertObj);
      const book = await db.findOne({ _id: insertObj.insertedId });
      // console.log("book", book);
      return [book];
    } else {
      return "missing required field title";
    }
  }

  async getAllBooks(req) {
    let db = req.app.locals.myDataBase;
    let listOfBooks = await db.find().toArray();
    //console.log("listOfBooks", listOfBooks);
    return listOfBooks;
  }

  async getBookById(req) {
    let db = req.app.locals.myDataBase;
    let book;
    try {
      book = await db.findOne({ _id: new ObjectId(req.params.id) });

      if (!book) {
        return "no book exists";
      }
    } catch (e) {
      console.log("error", e);
      return "no book exists";
    }
    // console.log("book", book);
    return book;
  }

  async commentOnBook(req) {
    let bookId = req.params.id;
    console.log("ID", bookId);
    //console.log(req.body);
    let comment = req.body.comment;
    console.log("comment:", comment);

    if (!comment) {
      return "missing required field comment";
    }
    let db = req.app.locals.myDataBase;
    let book;
    try {
      book = await db.findOneAndUpdate(
        { _id: new ObjectId(bookId) },
        { $push: { comments: comment }, $inc: { commentCount: 1 } },
        { returnDocument: "after" }
      );

      if (!book) {
        throw Error();
      }
      console.log("hee");
      console.log("BOOK:", book);
    } catch (error) {
      console.log(error);
      return "no book exists";
    }
    return book;
  }
}

module.exports = new BookController();
