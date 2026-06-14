const Ajv = require("ajv");
const addFormat = require("ajv-formats");

const ajv = new Ajv();
addFormat(ajv);

const schema = {
  type: "object",
  properties: {
    originalUrl: {
      type: "string",
      format: "uri",
    },
  },
  required: ["originalUrl"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;