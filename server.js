require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 1005;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`);
});
