class BookController {
  async logBook(req) {
    const db = req.app.locals.myDataBase;
    const insertObj = await db.insertOne({
      title: req.body.title,
      commentCount: 0,
    });
    // console.log(insertObj);
    const book = await db.findOne({ _id: insertObj.insertedId });
    // console.log("book", book);
    return [book];
  }
}

module.exports = new BookController();
