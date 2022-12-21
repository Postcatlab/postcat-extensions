/** get data type */
const getDataType = (data) => {
  return toString.call(data).slice(8, -1).toLocaleLowerCase();
};

type methodType = {
  tags: Array<string>;
  summary: string;
  operationId: string;
  requestBody: {
    description?: string;
    required?: boolean;
    content: {
      [key: string]: {
        schema: {};
      };
    };
  };
  responses: {
    default: {
      description: string;
      content: {};
    };
  };
  security: Array<{}>;
  "x-codegen-request-body-name"?: string;
};
type openAPIType = {
  openapi: string;
  info: {
    title: string;
    description: string;
    version: string;
    license: { name: string; url: string };
    contact: {};
    termsOfService: {};
  };
  externalDocs: { description: string; url: string };
  servers: Record<string, string>[];
  tags: Array<{
    name: string;
    description: string;
    externalDocs: { description: string; url: string };
  }>;
  paths: {
    servers?: Record<string, string>[];
    get?: methodType;
    post?: methodType;
    put?: methodType;
    delete?: methodType;
    option?: methodType;
  };
  components: {
    schemas: {};
    securitySchemes?: {};
  };
};
const bodyTypeHash = new Map().set("object", "json");
const structMap = new Map();
const typeMap = {
  integer: "int",
};

const formatType = (type: string) => {
  return typeMap[type] || type;
};

const parserParameters = (list: any[] = []) => {
  const queryParams = list
    .filter((it) => it.in === "path")
    .map((n) => ({
      ...n,
      example: String(n.schema?.default ?? ""),
      enum: n.schema?.enum?.map((item) => ({
        default: n.schema?.default === item,
        value: item,
      })),
    }));
  const restParams = list
    .filter((it) => it.in === "query")
    .map((n) => ({
      ...n,
      example: String(n.schema?.default ?? ""),
      enum: n.schema?.enum?.map((item) => ({
        default: n.schema?.default === item,
        value: item,
      })),
    }));
  const requestHeaders = list
    .filter((it) => it.in === "header")
    .map((n) => ({
      ...n,
      example: String(n.schema?.default ?? ""),
      enum: n.schema?.enum?.map((item) => ({
        default: n.schema?.default === item,
        value: item,
      })),
    }));
  return {
    queryParams,
    restParams,
    requestHeaders,
  };
};

// const parserItems = (data) => {
//   return {}
// }

const parserResponses = (data) => {
  if (!data) {
    console.log("Data is Empty");
    return {
      responseBodyType: "json",
    };
  }
  const { content } = data;
  // * contentList => ['*/*', 'application/json', 'application/xml']

  // * 仅取第一项
  const { schema }: any = Object.values(content).at(0);
  if (schema == null) {
    return {
      responseBodyType: "json",
      responseBody: [],
    };
  }
  if (schema["$ref"]) {
    const { properties, required, type } = structMap.get((schema["$ref"] as string).split("/").at(-1));
    return {
      responseBodyType: bodyTypeHash.get(type) || "json",
      responseBodyJsonType: type,
      responseBody: parserProperties(properties, required),
    };
  }
};

const get$Ref = (prop: Record<string, any> = {}) => {
  const { items, allOf, anyOf, oneOf } = prop;
  const of = [allOf, anyOf, oneOf].find((n) => n)?.[0];
  return (items || of)?.$ref;
};

const parserItems = (path) => {
  if (path == null) {
    return {};
  }
  const { type, properties, required } = structMap.get((path as string).split("/").at(-1));
  return {
    type,
    children: parserProperties(properties, required),
  };
};

const parserProperties = (properties, required: string[] = []) => {
  return Object.entries(properties).map(([key, value]: any) => {
    const { type, description, default: defaultValue } = value;
    const ref = get$Ref(value);
    return {
      // ...other,
      ...parserItems(ref),
      name: key,
      required: required.includes(key),
      example: String(defaultValue || ""),
      type: formatType(type) || getDataType(defaultValue ?? ""),
      description: description || "",
    };
  });
};

const parserRequests = (requestBody) => {
  const content = requestBody?.content;
  if (content == null) {
    return {
      requestBodyType: "json",
      requestBody: [],
    };
  }
  // * 仅取第一项
  const { schema }: any = Object.values(content).at(0);
  if (schema == null) {
    return {
      requestBodyType: "json",
      requestBody: [],
    };
  }
  if (schema["$ref"]) {
    const { properties, required, type } = structMap.get((schema["$ref"] as string).split("/").at(-1));
    return {
      requestBodyType: bodyTypeHash.get(type) || "json",
      requestBodyJsonType: type,
      requestBody: parserProperties(properties, required),
    };
  }
};

const toOpenapi = ({
  method,
  url,
  summary,
  operationId,
  parameters,
  responses,
  requestBody,
  // description,
}) => {
  return {
    name: summary || operationId || url,
    protocol: "http", // * openapi 中没有对应字段
    uri: url,
    projectID: 1,
    method: method.toUpperCase(),
    ...parserRequests(requestBody),
    ...parserParameters(parameters),
    ...parserResponses(responses?.["200"]),
  };
};

export const importFunc = (openapi: openAPIType) => {
  if (Object.keys(openapi).length === 0) {
    return [null, { msg: "请上传合法的文件" }];
  }
  if (!openapi.openapi) {
    return [null, { msg: "文件不合法，缺乏 openapi 字段" }];
  }
  const enviroments = {
    hostUri: "",
    name: "",
    parameters: [] as { name: string; value: string }[],
  };
  // * 先从 components 字段中读取出结构体
  // console.log('==>>', openapi)
  const { components, paths, tags = [], servers, info } = openapi;

  const setEnv = (servers: Record<string, string>[] = []) => {
    if (servers && Array.isArray(servers) && servers.length) {
      servers.forEach((n) => {
        if (!enviroments.hostUri) {
          enviroments.hostUri = n.url;
          enviroments.name = n.url;
        } else {
          enviroments.parameters.push({
            name: n.url,
            value: n.url,
          });
        }
      });
    }
  };

  setEnv(servers);

  if (components) {
    const { schemas } = components;
    if (schemas) {
      Object.keys(schemas).forEach((it) => {
        structMap.set(it, schemas[it]);
      });
    }
  }
  const groups = tags.reduce((prev, curr) => {
    prev[curr.name] = { name: curr.name, children: Array() };
    return prev;
  }, {});
  const apiDatas = Object.keys(paths)
    .map((url) => {
      const list: any = [];

      Object.keys(paths[url]).forEach((method: string) => {
        if (method === "servers") {
          setEnv(paths.servers);
        } else {
          list.push({
            method,
            url,
            ...paths[url][method],
          });
        }
      });
      return list;
    })
    .flat(Infinity)
    .map((item) => {
      const groupName = item.tags?.[0];
      let group;
      if (groupName) {
        group = groups[groupName] ??= {
          name: groupName,
          children: [],
        };
      }
      // console.log('item', item)
      const apiData = toOpenapi(item);
      if (group) {
        group.children.push(apiData);
      } else {
        return apiData;
      }
    })
    .filter(Boolean);
  console.log(
    JSON.parse(
      JSON.stringify({
        collections: [...tags, ...apiDatas],
        enviroments: [],
      })
    )
  );
  // const environment = []
  // const group = []

  // return [
  //   {
  //     environment,
  //     group,
  //     apiData
  //   },
  //   null
  // ]
  return [
    {
      collections: [
        {
          name: info.title,
          children: [...Object.values(groups), ...apiDatas],
        },
      ],
      enviroments: enviroments.hostUri ? enviroments : [],
    },
    null,
  ];
};
