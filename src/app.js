const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.route");
const urlRouter = require("./routes/url.route");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({
        message: "URL Shortener API is running"
    });
});

/**
 * USE /api/auth 
 * AuthRouter for Authentication
 */
app.use("/api/auth", authRouter);

/**
 * USE /api/url
 * UrlRouter for urls
 */
app.use("/api/urls", urlRouter);

module.exports = app;
