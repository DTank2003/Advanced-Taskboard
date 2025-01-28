const express = require("express");
const { getNotifications, markAsRead,createNotification, markAllAsRead, markRead } = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware(['admin','manager','user']), getNotifications);
router.patch("/markAsRead/:id", authMiddleware(['admin','manager','user']), markAsRead);
router.patch("/markAllAsRead", authMiddleware(['admin','manager','user']), markAllAsRead);
router.post('/', authMiddleware(['admin','manager','user']), createNotification);

module.exports = router;