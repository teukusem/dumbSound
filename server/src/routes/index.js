const express = require("express");

const router = express.Router();

const { addUser, getUsers, getUser, updateUser, deleteUser } = require("../controllers/user");
const { addTransaction, getTransactions, getTransaction, notification, deleteTransaction } = require("../controllers/transaction");
const { getArtiss, getArtis, addArtis, deleteArtis, updateArtis } = require("../controllers/artis");
const { getHistorys, addHistory } = require("../controllers/history");
const { register, login, checkAuth } = require("../controllers/auth");
const { likeById, likelike } = require("../controllers/like");
const { musics, addMusic, deleteMusic, updateMusic, getMusic } = require("../controllers/music");
const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

// Users
router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.patch("/user/:id", updateUser);

// Music
// router menampikan data
router.get("/musics", musics);
router.get("/music/:id", getMusic);
router.post("/add-music", uploadFile("imageSong", "fileSong"), addMusic);
router.patch("/music/:id", uploadFile("imageSong", "fileSong"), updateMusic);
router.delete("/music/:id", deleteMusic);

// Like
router.post("/like", auth, likelike);
router.get("/like/:id", likeById);

// Artis
router.get("/artis", getArtiss);
router.get("/artis/:id", getArtis);
router.patch("/artis/:id", updateArtis);
router.post("/add-artis", addArtis);
router.delete("/artis/:id", deleteArtis);

// History
router.post("/add-history", addHistory);
router.get("/historys", getHistorys);

// Transaction
router.get("/transactions", auth, getTransactions);
router.post("/transaction", auth, addTransaction);
router.delete("/transaction/:id", auth, deleteTransaction);

// Login & Register
router.post("/register", register);
router.post("/login", login);
router.get("/check-auth/", auth, checkAuth);

// Notification for midrans
router.post("/notification", notification);

module.exports = router;
