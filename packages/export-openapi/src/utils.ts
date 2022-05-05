import * as _ from "lodash";

const parseParamsInUrl = (url): string[] =>
  url.match(/(?<={)(\S)+?(?=})/g) || [];

export const setBase = (meta) => ({
  openapi: "3.0.1",
  info: {
    title: meta.name,
    description: meta.name,
    termsOfService: "",
    contact: {},
    license: {
      name: "Apache 2.0",
      url: "http://www.apache.org/licenses/LICENSE-2.0.html"
    },
    version: "1.0.0"
  },
  externalDocs: {
    description: "Find out more about Swagger",
    url: "http://swagger.io"
  },
  servers: [],
  paths: {},
  tags: [],
  components: []
});

export const setTags = (data, sourceData) => {
  const { group } = sourceData;
  return _.set(
    data,
    ["tags"],
    group.map(({ name }) => ({
      name,
      description: name,
      externalDocs: {}
    }))
  );
};

export const setPaths = (data, sourceData) => {
  const keys = parseParamsInUrl(sourceData.uri);
  const _data = JSON.parse(JSON.stringify(data));
  return {
    ..._data,
    paths: {
      [sourceData.uri]: {
        [sourceData.method.toLowerCase()]: keys.reduce(
          (total, key) => ({
            [key]: {
              tags: [],
              summary: "",
              operationId: "",
              requestBody: {
                description: "",
                content: {},
                require: true
              },
              responses: {
                "200": {
                  description: "OK",
                  content: ""
                }
              },
              security: [],
              "x-codegen-request-body-name": "body"
            },
            ...total
          }),
          {}
        )
      }
    }
  };
};

export const setRequest = (data, sourceData) => {
  const { responseBody } = sourceData;
  return _.set(data, ["requestBody", "content"], {});
};

export const setResponse = (data, sourceData) => {
  const { responseBodyType, uri, method } = sourceData;
  return _.set(
    data,
    [
      "paths",
      uri,
      method.toLowerCase(),
      "responses",
      "content",
      "application/" + responseBodyType
    ],
    {
      schema: {
        type: "object"
      }
    }
  );
};
