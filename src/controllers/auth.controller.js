const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authValidate = require("../validators/auth.validator");

async function registerUser(req, res) {

    console.log(req.body);

    const { email, password } = req.body;

    if (!authValidate(req.body)) {
        return res.status(400).json({
            errors: authValidate.errors
        })
    }

    const isEmailExist = await pool.query(
      `SELECT * FROM users
        WHERE email = $1`,
      [email],
    );

    if (isEmailExist.rows.length != 0) {
      return res.status(403).json({
        message: "User already exists",
      });
    }

    try {
        const hash_password = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO users 
            (email, password) VALUES ($1, $2)`,
            [email, hash_password]
        );

        res.status(201).json({
            message: "Registration Completed"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!authValidate(req.body)) {
            return res.status(400).json({
                errors: authValidate.errors
            })
        }

        const result = await pool.query(
            `SELECT * FROM users
            WHERE email = $1`,
            [email]
        );

        if (result.rows.length == 0) {
            return res.status(401).json({
                message: "User does not exists"
            });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 //1 Day
        })

        res.status(200).json({
            message: "Login successfully",
            token
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

async function updateUser(req, res) {
    try {

        const userId = req.user.id;
        const { email, password } = req.body;

        if (!authValidate(req.body)) {
            return res.status(400).json({
                error: authValidate.errors
            })
        }

        const isEmailExists = await pool.query(
            `SELECT
                email
            FROM users
            WHERE email = $1`,
            [email]
        );

        if (isEmailExists.rows.length > 0) {
            return res.status(409).json({
                message: "Email already exist"
            })
        }

        const result = await pool.query(
            `SELECT password
            FROM users
            WHERE id = $1`,
            [userId]
        );

        const isMatch = await bcrypt.compare(password, result.rows[0].password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const updated = await pool.query(
            `UPDATE users
            SET email = $1
            WHERE id = $2
            RETURNING email`,
            [email, userId]
        );

        res.status(200).json({
            user: updated.rows[0]
        })
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error"
        })
    }
}

async function deleteUser(req, res) {
    try {
        
        const userId = req.user.id;
        const { password } = req.body;

        const result = await pool.query(
            `SELECT password
            FROM users
            WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        const isMatch = await bcrypt.compare(password, result.rows[0].password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        await pool.query(
            `DELETE FROM users
            WHERE id = $1`,
            [userId]
        );

        res.clearCookie("token");

        return res.status(200).json({
            message: "User deleted successfully"
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error"
        })
    }
}

module.exports = { registerUser, loginUser, updateUser, deleteUser };