const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const checkRole = require("../middleware/roleMiddleware");

const db = require("../config/db");

router.get("/summary", [auth, checkRole(["admin"])], async (req, res) => {
  try {
    const [totalTicketsResult] = await db.query(
      "SELECT COUNT(*) as count FROM tickets"
    );

    const totalTickets = totalTicketsResult[0].count;

    const [statusCountsResult] = await db.query(`

SELECT status, COUNT(*) as count

FROM tickets

GROUP BY status

`);

    const statusCounts = statusCountsResult.reduce((acc, row) => {
      acc[row.status] = row.count;

      return acc;
    }, {});

    const [dailyCountsResult] = await db.query(`

SELECT DATE(created_at) as date, COUNT(*) as count

FROM tickets

WHERE created_at >= CURDATE() - INTERVAL 7 DAY

GROUP BY DATE(created_at)
ORDER BY date ASC

`);

    const dailyCounts = dailyCountsResult;

    res.json({
      totalTickets,

      statusCounts,

      dailyCounts,
    });
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
});

module.exports = router;
