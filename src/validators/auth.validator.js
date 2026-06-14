const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv();
addFormats(ajv);

const schema = {
    type: "object",
    properties: {
        email: { type: "string", format: "email" },
        password: { type: "string" },
      },
    required: ["email", "password"],
    additionalProperties: false,
};

const validate = ajv.compile(schema);

module.exports = validate;