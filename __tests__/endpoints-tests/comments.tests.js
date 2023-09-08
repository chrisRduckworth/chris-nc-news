const request = require("supertest");
const app = require("../../app");

exports.commentTests = () => {
  describe("DELETE /api/comments/:commend_id", () => {
    it("should delete comment with given id, responds with status 204 no content", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    it("should return 404 not found when given an id with no associated comment", () => {
      return request(app)
        .delete("/api/comments/500")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found");
        });
    });
    it("should return 400 bad request when given an invalid id", () => {
      return request(app)
        .delete("/api/comments/banana")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
  });

  describe("PATCH /api/comments/:comment_id", () => {
    it("should increase the votes on specified comment if given positive", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 2 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 9,
            votes: 18,
            created_at: expect.any(String),
          });
        });
    });
    it("should decrease the votes if given negative value", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: -3 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 9,
            votes: 13,
            created_at: expect.any(String),
          });
        });
    });
    it("should return 404 not found if given valid id with no associated comment", () => {
      return request(app)
        .patch("/api/comments/500")
        .send({ inc_votes: -3 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not Found");
        });
    });
    it("should return 400 Bad Request if given invalid comment id", () => {
      return request(app)
        .patch("/api/comments/bananas")
        .send({ inc_votes: -3 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
    it("should return 400 Bad Request if given malformed body", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
    it("should return 400 Bad Request if given body with invalid inc_votes data type", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "bananas" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
  });
  describe.only("GET /api/comments", () => {
    it("should return with all comments when sent a request, sorted by date descending", () => {
      return request(app)
        .get("/api/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(18);
          expect(comments).toBeSortedBy("created_at", { descending: true });
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id"),
              expect(comment).toHaveProperty("article_id"),
              expect(comment).toHaveProperty("author"),
              expect(comment).toHaveProperty("votes"),
              expect(comment).toHaveProperty("created_at"),
              expect(comment).toHaveProperty("body");
          });
        });
    });
  });
};
