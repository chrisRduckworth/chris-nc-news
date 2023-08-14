const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const app = require("../app");
const db = require("../db/connection");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("incorrect path", () => {
  test("should return 404 on incorrect path", () => {
    return request(app).get("/api/tipics").expect(404);
  });
});

describe("GET /api/items", () => {
  it("responds with an array of topic objects, each of which should have properties slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { topics } = response.body;
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
        expect(topics).toHaveLength(3);
      });
  });
});

describe("GET /api", () => {
  it("responds with a JSON object, each key is a valid path", () => {
    const pathRegex = /(GET|POST|PATCH|DELETE) \/api(\/:?[a-z_]*)*/g;
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        Object.keys(body).forEach((key) => {
          expect(key).toMatch(pathRegex);
        });
      });
  });
  it("responds with an object, where each value is an object with the correct keys", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        Object.values(body).forEach((endpoint) => {
          expect(Object.keys(endpoint)).toHaveLength(4);
          expect(endpoint).toHaveProperty("description");
          expect(endpoint).toHaveProperty("queries");
          expect(endpoint).toHaveProperty("format");
          expect(endpoint).toHaveProperty("exampleResponse");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("should respond with an article by its id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          author: "icellusedkars",
          title: "Eight pug gifs that remind me of mitch",
          article_id: 3,
          body: "some gifs",
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("should response with a 404 Not Found error if no article is found with specified id", () => {
    return request(app)
      .get("/api/articles/900")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("should respond with a 400 Invalid id error if sent incorrect data type for id", () => {
    return request(app)
      .get("/api/articles/bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Id");
      });
  });
});

describe("GET /api/articles", () => {
  it("should respond with an array of all article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toHaveLength(13);
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
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
