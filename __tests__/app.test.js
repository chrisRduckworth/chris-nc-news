const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");

const {
  articleTests,
  commentTests,
  miscTests,
  topicTests,
  userTests,
} = require("./endpoints-tests/index.tests");

beforeEach(() => seed(testData));
afterAll(() => db.end());

articleTests();
commentTests();
miscTests();
topicTests();
userTests();
