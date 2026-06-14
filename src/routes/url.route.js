const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const urlController = require("../controllers/url.controller");

const router = express.Router();

/**
 * POST /api/urls/create
 * To generate Short Id of originalUrl
 */
router.post("/create", authMiddleware, urlController.generateUrl);

/**
 * GET /api/urls/
 * To get all the urls created by the user
 */
router.get("/", authMiddleware, urlController.allUrls);

/**
 * GET /api/urls/:shortId
 * To redirect the originalUrl by the given shortId
 */
router.get("/:shortId", urlController.redirectUrl);

/**
 * DELETE /api/urls/delete/:shortId
 * Delete the originalUrl using the given shortId
 */
router.delete("/delete/:shortId", authMiddleware, urlController.deleteUrl);

/**
 * POST /api/urls/stats/:shortId
 * Give analytics of the url 
 */
router.get("/stats/:shortId", authMiddleware, urlController.statsUrl);

/**
 * PATCH /api/urls/update/:shortId
 * Update the originalUrl 
 */
router.patch("/update/:shortId", authMiddleware, urlController.updateUrl);

module.exports = router;