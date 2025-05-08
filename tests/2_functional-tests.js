/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
   * ----[END of EXAMPLE TEST]----
   */
  function createRandomString(length) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  const properties = ["_id", "title", "commentcount"];
  let sampleBook;
  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post("/api/books")
            .send({
              title: createRandomString(8),
            })
            .end(function (err, res) {
              // console.log(res.body);
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.containsAllKeys(res.body, [
                "_id",
                "title",
                "commentcount",
              ]);

              done(err);
            });
        });
        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post("/api/books")
            .send({})
            .end(function (err, res) {
              // console.log(res.body);
              assert.equal(res.status, 200);
              assert.isString(res.body);
              assert.equal(res.body, "missing required field title");
              done(err);
            });
        });
      }
    );
    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .keepOpen()
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            // console.log(res.body);
            assert.isArray(res.body);
            if (res.body.length !== 0) {
              const firstBook = res.body[0];
              sampleBook = firstBook; //set sampleBook for test later on
              assert.containsAllKeys(firstBook, properties);
            }
            done(err);
          });
      });
    });
    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .keepOpen()
          .get("/api/books/680f8036fd4423904358a473")
          .end(function (err, res) {
            //     console.log("???WAT?", res.body);
            assert.equal(res.status, 200);
            assert.isString(res.body);
            assert.equal(res.body, "no book exists");
            done(err);
          });
      });
      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .keepOpen()
          .get(`/api/books/${sampleBook._id}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.containsAllKeys(res.body, properties);
            // console.log(res.body);
            done(err);
          });
      });
    });
    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post(`/api/books/${sampleBook._id}`)
            .send({ comment: createRandomString(7) })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.containsAllKeys(res.body, [
                ...properties,
                "comments",
                "commentcount",
              ]);
              assert.equal(res.body.comments.length, res.body.commentcount);
              done(err);
            });
        });
        test("Test POST /api/books/[id] without comment field", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post(`/api/books/${sampleBook._id}`)
            .send()
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body, "missing required field comment");
              done(err);
            });
        });
        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .keepOpen()
            .post(`/api/books/6810b080607c0d111d150ef2`)
            .send({ comment: createRandomString(7) })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body, "no book exists");
              done(err);
            });
        });
      }
    );
    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .keepOpen()
          .delete(`/api/books/6810b080607c0d111d150ef2`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists");
            done(err);
          });
      });
      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        chai
          .request(server)
          .keepOpen()
          .delete(`/api/books/${sampleBook._id}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "delete successful");
            done(err);
          });
      });
      test("Test DELETE /api/books/", function (done) {
        chai
          .request(server)
          .keepOpen()
          .delete(`/api/books`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "complete delete successful");
            done(err);
          });
      });
    });
  });
});
