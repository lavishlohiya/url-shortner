const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * POST /api/auth/register
 * To register user
 */
router.post("/register", authController.registerUser);

/**
 * POST /api/auth/login
 * To login user
 */
router.post("/login", authController.loginUser);

/**
 * PATCH /api/auth/update
 * Update email of the user 
 */
router.patch("/update", authMiddleware, authController.updateUser);

/**
 * DELETE /api/auth/delete
 * Delete the user
 */
router.delete("/delete", authMiddleware, authController.deleteUser);

module.exports = router;