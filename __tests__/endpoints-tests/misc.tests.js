const request = require("supertest");
const app = require("../../app");

exports.miscTests = () => {
  describe("incorrect path", () => {
    test("should return 404 on incorrect path with custom error msg", () => {
      return request(app)
        .get("/api/tipics")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Path not found");
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
    it("should respond with the correct number of endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const controllers = [
            "api",
            "articles",
            "comments",
            "topics",
            "users",
          ];
          const controllerFunctions = controllers.map((str) =>
            require(`../../controllers/${str}-controllers.js`)
          );
          const numOfEndpoints = controllerFunctions.reduce(
            (acc, cur) => acc + Object.keys(cur).length,
            0
          );
          expect(Object.keys(body).length).toBe(numOfEndpoints);
        });
    });
  });
};
