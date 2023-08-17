const request = require("supertest");
const app = require("../../app");
const db = require("../../db/connection");

exports.articleTests = () => {
  describe("GET /api/articles/:article_id", () => {
    it("should respond with an article by its id", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: "icellusedkars",
              title: "Eight pug gifs that remind me of mitch",
              article_id: 3,
              body: "some gifs",
              topic: "mitch",
              created_at: "2020-11-03T09:12:00.000Z",
              votes: 0,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            })
          );
        });
    });
    it("should response with a 404 Not Found error if no article is found with specified id", () => {
      return request(app)
        .get("/api/articles/900")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found");
        });
    });
    it("should respond with a 400 Bad Request error if sent incorrect data type for id", () => {
      return request(app)
        .get("/api/articles/bananas")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
  });

  describe("GET /api/articles", () => {
    it("should respond with an array of all article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles, total_count } = body;
          expect(total_count).toBe(13);
          articles.forEach((article) => {
            expect(Object.keys(article)).toIncludeSameMembers([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "article_img_url",
              "comment_count",
            ]);
          });
        });
    });
    it("should sort the articles by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });

  describe("GET /api/articles/:article_id/comments", () => {
    it("should respond with an array of comments with the given article_id, sorted by date", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=100")
        .expect(200)
        .then(({ body: { comments } }) => {
          const keys = [
            "comment_id",
            "votes",
            "created_at",
            "author",
            "body",
            "article_id",
          ];
          expect(comments).toHaveLength(11);
          expect(comments).toBeSortedBy("created_at", { descending: true });
          comments.forEach((comment) => {
            expect(Object.keys(comment)).toEqual(expect.arrayContaining(keys));
          });
        });
    });
    it("should respond with 404 Not Found if no article is found with given id", () => {
      return request(app)
        .get("/api/articles/500/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found");
        });
    });
    it("should respond with 400 Bad Request if given incorrect data type for id", () => {
      return request(app)
        .get("/api/articles/bananas/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
    it("should respond with 200 and empty array if given a valid article but it has no comments", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    it("should post a new comment to an article", () => {
      const newComment = {
        username: "butter_bridge",
        body: "perfect 5/7",
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toHaveProperty("comment_id", 19);
          expect(comment).toHaveProperty("body", "perfect 5/7");
          expect(comment).toHaveProperty("article_id", 2);
          expect(comment).toHaveProperty("author", "butter_bridge");
          expect(comment).toHaveProperty("votes", 0);
          expect(comment).toHaveProperty("created_at");
        });
    });
    it("should respond with 404 Not Found when given an article id with doesn't exist", () => {
      const newComment = {
        username: "butter_bridge",
        body: "perfect 5/7",
      };
      return request(app)
        .post("/api/articles/500/comments")
        .send(newComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found");
        });
    });
    it("should respond with 400 Bad Request when sent an Bad Request", () => {
      const newComment = {
        username: "butter_bridge",
        body: "perfect 5/7",
      };
      return request(app)
        .post("/api/articles/bananas/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
    it("should respond with 400 Bad Request when send a malformed body", () => {
      const newComment = {};
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
    it("should respond with 400 Bad Request when send a body with invalid values", () => {
      const newComment = {
        body: "blah blah blah",
        user_name: 0,
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
  });

  describe("PATCH /api/articles/:article_id", () => {
    it("should increase votes of article if given positive inc_votes", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 5 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 105,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    it("should decrease votes of article if given negative inc_votes", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -5 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 95,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    it("should return 400 Bad Request if article_id is invalid", () => {
      return request(app)
        .patch("/api/articles/bananas")
        .send({ inc_votes: 5 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
    it("should return 404 Not Found if article_id no such article exists", () => {
      return request(app)
        .patch("/api/articles/500")
        .send({ inc_votes: 5 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found");
        });
    });
    it("should return 400 Bad Request when sent malformed body", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
    it("should return 400 Bad Request when sent non-number inc_votes", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: "blah" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
  });

  describe("FEATURE GET/api/articles (queries)", () => {
    describe("topic", () => {
      it("should filter by topic valuued specified in query", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            const { articles, total_count } = body;
            expect(total_count).toBe(12);
            articles.forEach((article) => {
              expect(article).toHaveProperty("topic", "mitch");
            });
          });
      });
      it("should return empty array if no articles have that topic", () => {
        return request(app)
          .get("/api/articles?topic=bananas")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toEqual([]);
          });
      });
    });
    describe("sort_by", () => {
      it("should sort articles by specified column", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("comment_count", {
              descending: true,
              coerce: true,
            });
          });
      });
      it("should return 400 Invalid sort query if given invalid sort query", () => {
        return request(app)
          .get("/api/articles?sort_by=bananas")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid Sort Query");
          });
      });
    });
    describe("order", () => {
      it("should order ascending or descending depending on order query", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at");
          });
      });
      it("should return 400 Invalid Order Query when sent invalid order", () => {
        return request(app)
          .get("/api/articles?order=bananas")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid Order Query");
          });
      });
    });
    it("should accept combinations of queries", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=title&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("title");
          articles.forEach((article) => {
            expect(article).toHaveProperty("topic", "mitch");
          });
        });
    });
  });

  describe("FEATURE GET /api/articles:article_id (comment_count)", () => {
    it("should respond with an article object with the comment_count included", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toHaveProperty("comment_count", 11);
        });
    });
  });

  describe("POST /api/articles", () => {
    it("should post a new article and return it", () => {
      const newArticle = {
        author: "butter_bridge",
        title: "the importance of the heart of the cards",
        body: "im the king baby",
        topic: "paper",
        article_img_url:
          "https://static1.srcdn.com/wordpress/wp-content/uploads/2017/05/Joey-Wheeler-Pointy-Chin-Yu-Gi-Oh.jpg",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            author: "butter_bridge",
            title: "the importance of the heart of the cards",
            body: "im the king baby",
            topic: "paper",
            article_img_url:
              "https://static1.srcdn.com/wordpress/wp-content/uploads/2017/05/Joey-Wheeler-Pointy-Chin-Yu-Gi-Oh.jpg",
            article_id: 14,
            votes: 0,
            created_at: expect.any(String),
            comment_count: 0,
          });
        });
    });
    it("should post a new article when article_img_url is not provided in body", () => {
      const newArticle = {
        author: "butter_bridge",
        title: "the importance of the heart of the cards",
        body: "im the king baby",
        topic: "paper",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            author: "butter_bridge",
            title: "the importance of the heart of the cards",
            body: "im the king baby",
            topic: "paper",
            article_id: 14,
            votes: 0,
            created_at: expect.any(String),
            comment_count: 0,
          });
        });
    });
    it("should create new topic if given topic does not exist", () => {
      const newArticle = {
        author: "butter_bridge",
        title: "the importance of the heart of the cards",
        body: "im the king baby",
        topic: "children's card games",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            author: "butter_bridge",
            title: "the importance of the heart of the cards",
            body: "im the king baby",
            topic: "children's card games",
            article_id: 14,
            votes: 0,
            created_at: expect.any(String),
            comment_count: 0,
          });
        });
    });
    it("should return 400 bed request when user does not exist", () => {
      const newArticle = {
        author: "joey_wheeler",
        title: "the importance of the heart of the cards",
        body: "im the king baby",
        topic: "paper",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
    it("should return 400 bad request when given malformed body", () => {
      return request(app)
        .post("/api/articles")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
  });

  describe("GET /api/articles (pagination)", () => {
    describe("limit", () => {
      it("should limit the number of results according to the limit query", () => {
        return request(app)
          .get("/api/articles?limit=8")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(8);
          });
      });
      it("should accept limits above total number of responses", () => {
        return request(app)
          .get("/api/articles?limit=10000")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(13);
          });
      });
      it("should default limit <= 0 to 10", () => {
        return request(app)
          .get("/api/articles?limit=-5")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(10);
          });
      });
      it("should return 400 Invalid Limit if sent invalid data type for limit", () => {
        return request(app)
          .get("/api/articles?limit=bananas")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid Limit");
          });
      });
    });
    describe("p", () => {
      it("should return the specified page of results", () => {
        return request(app)
          .get("/api/articles?p=2")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(3);
          });
      });
      it("should return 200 but now rows if given page beyond answers", () => {
        return request(app)
          .get("/api/articles?p=100")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(0);
          });
      });
      it("should default page to 1 if given page <= 0", () => {
        return request(app)
          .get("/api/articles?p=-5")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(10);
          });
      });
      it("should return 400 Invalid Page if given invalid data type", () => {
        return request(app)
          .get("/api/articles?p=bananas")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid Page");
          });
      });
    });
    describe("total_count", () => {
      it("should return a total count property equal to the total number of returned values", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { total_count } }) => {
            expect(total_count).toBe(13);
          });
      });
      it("should return a total count according to filters", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { total_count } }) => {
            expect(total_count).toBe(12);
          });
      });
    });
    it("should be able to accept a combination of queries", () => {
      return request(app)
        .get("/api/articles?topic=mitch&limit=8&p=2")
        .expect(200)
        .then(({ body }) => {
          const { articles, total_count } = body;
          expect(total_count).toBe(12);
          expect(articles).toHaveLength(4);
        });
    });
  });

  describe("GET /api/articles/:article_id/comments (pagination)", () => {
    describe("limit", () => {
      it("should limit the number of results according to the limit query", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=5")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(5);
          });
      });
      it("should accept limits above total number of responses", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=1000")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(11);
          });
      });
      it("should default limits <= 0 to 10", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=-5")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(10);
          });
      });
      it("should return 400 Invalid Limit if sent invalid data type for limit", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=bananas")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid Limit");
          });
      });
    });
    describe("p", () => {
      it("should return specified page of results", () => {
        return request(app)
          .get("/api/articles/1/comments?p=2")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(1);
          });
      });
      it("should return 200 but no rows if given page beyond answers", () => {
        return request(app)
          .get("/api/articles/1/comments?p=10")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(0);
          });
      });
      it("should default page <= 0 to 1", () => {
        return request(app)
          .get("/api/articles/1/comments?p=-5")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(10);
          });
      });
      it("should return 400 Invalid Page if given invalid data type", () => {
        return request(app)
          .get("/api/articles/1/comments?p=bananas")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid Page");
          });
      });
    });
    it("should accept a combination of queries", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=7&p=2")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(4);
        });
    });
  });
  
  describe("DELETE /api/articles/:article_id", () => {
    it("should delete the specified article", () => {
      return request(app)
        .delete("/api/articles/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
          return db.query("SELECT * FROM articles;");
        })
        .then(({ rows }) => {
          expect(rows).toHaveLength(12);
        });
    });
    it("should return 404 not found if given a valid id but no such article exists", () => {
      return request(app)
        .delete("/api/articles/500")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found");
        });
    });
    it("should return 400 Bad Request when sent an invalid id", () => {
      return request(app)
        .delete("/api/articles/bananas")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
  });
};
