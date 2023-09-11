const express = require("express");
const { register, login, logout } = require("../Controller/userController");
const {
  blog,
  updateblog,
  getblog,
  deleteData,
  getone,
} = require("../Controller/blogController");
const image = require("../middleware/multer");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/blog", blog);
router.put("/updateblog/:id", updateblog);
router.get("/getblog", getblog);
router.delete("/deleteData/:id", deleteData);
router.get("/getone/:id", getone);

module.exports = router;
