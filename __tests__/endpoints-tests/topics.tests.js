const request = require("supertest");
const app = require("../../app");

exports.topicTests = () => {
  describe("GET /api/topics", () => {
    it("responds with an array of topic objects, each of which should have properties slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
          });
          expect(topics).toHaveLength(3);
        });
    });
  });

  describe("POST /api/topics", () => {
    it("should add the provided new topic to the database", () => {
      const newTopic = {
        slug: "children's card games",
        description: "they're for children, honest",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(201)
        .then(({ body: { topic } }) => {
          expect(topic).toMatchObject({
            slug: "children's card games",
            description: "they're for children, honest",
          });
        });
    });
    it("should return 400 Bad Request if sent malformed body", () => {
      return request(app)
        .post("/api/topics")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
    it("should return 400 Bad Request if sent a topic name which already exists", () => {
      const newTopic = {
        slug: "cats",
        description: "they're not hamsters either",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
  });
};
