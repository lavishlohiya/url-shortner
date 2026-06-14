const pool = require("../config/db");
const ShortUniqueId = require("short-unique-id");
const urlValidate = require("../validators/url.validator");

async function generateUrl(req, res) {
    
    try {
        const userId = req.user.id;
        const { originalUrl } = req.body;

        if (!urlValidate(req.body)) {
            return res.status(400).json({
                errors: urlValidate.errors
            })
        }

        try {
          new URL(originalUrl);
        } catch {
          return res.status(400).json({
            message: "Invalid URL",
          });
        }

        const uid = new ShortUniqueId({ length: 10 });
        const shortId = uid.rnd();

        await pool.query(
            `INSERT INTO urls (user_id,original_url, short_id) VALUES ($1, $2, $3)`,
            [userId, originalUrl, shortId]
        );

        res.status(201).json({
            message: "Short Id created successfully",
            urls: {
                originalUrl,
                shortId
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

async function allUrls(req, res) {
    try {
        const userId = req.user.id;

        const result = await pool.query(
          `SELECT
                short_id AS "shortId",
                original_url AS "originalUrl",
                click_count AS "clickCount"
            FROM urls
            WHERE user_id = $1
            ORDER BY created_at DESC`,
          [userId],
        );

        res.status(200).json({
            urls: result.rows
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

async function redirectUrl(req, res) {
    try {
        
        const shortId = req.params.shortId;

        const result = await pool.query(
            `SELECT * FROM urls
            WHERE short_id = $1`,
            [shortId]
        );

        await pool.query(
            `UPDATE urls
            SET click_count = click_count + 1
            WHERE short_id = $1`,
            [shortId]
        );

        if (result.rows.length == 0) {
            return res.status(404).json({
                message: "Invalid Short Id"
            });
        }

        const originalUrl = result.rows[0].original_url;

        return res.redirect(originalUrl);

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

async function deleteUrl(req, res) {
  try {
    const shortId = req.params.shortId;
    const userId = req.user.id;

    const result = await pool.query(
      `DELETE FROM urls
             WHERE user_id = $1
             AND short_id = $2
             RETURNING *`,
      [userId, shortId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "URL not found or you do not own it",
      });
    }

    return res.status(200).json({
      message: "Deleted successfully",
    });
      
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server Error",
    });
  }
}

async function statsUrl(req, res) {
    try {
        const shortId = req.params.shortId;
        const userId = req.user.id;

        const result = await pool.query(
          `SELECT 
                short_id AS "shortId",
                original_url AS "originalUrl",
                click_count AS "clickCount",
                created_at AS "createdAt"
            FROM urls
            WHERE user_id = $1
            AND short_id = $2`,
          [userId, shortId],
        );

        if (result.rows.length === 0) {
           return res.status(404).json({
            message: "URL not found",
          });
        }

        return res.status(200).json({
            analytics: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error"
        })
    }
}

async function updateUrl(req, res) {
    try {
        
        const shortId = req.params.shortId;
        const userId = req.user.id;
        const { originalUrl } = req.body;

        if (!urlValidate(req.body)) {
            return res.status(400).json({
                errors: urlValidate.errors
            })
        }

        try {
          new URL(originalUrl);
        } catch {
          return res.status(400).json({
            message: "Invalid URL",
          });
        }

        const result = await pool.query(
            `UPDATE urls
            SET original_url = $1
            WHERE user_id = $2
            AND short_id = $3
            RETURNING
                short_id AS "shortId",
                original_url AS "originalUrl",
                click_count AS "clickCount"`,
            [originalUrl, userId, shortId]
        );

        if (result.rows.length == 0) {
            return res.status(404).json({
              message: "URL not found or you do not own it",
            });
        }

        return res.status(200).json({
            updatedUrl: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = {
    generateUrl, allUrls, redirectUrl,
    deleteUrl, statsUrl, updateUrl
};