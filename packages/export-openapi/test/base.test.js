const eoapi = require("../mocks/eoapi.json");
const { export_convert } = require("../dist/index.js");

test("base", () => {
  const data = export_convert(eoapi);
  expect(data).toEqual(openAPI);
});
