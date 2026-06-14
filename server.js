require("dotenv").config();
const app = require("./src/app");

app.listen(1005, () => {
    console.log("Server is running on 1005 port")
});