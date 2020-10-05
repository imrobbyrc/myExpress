const { createUser, findUser, getUsers, updateUser, deleteUser, login } = require("./user.controller");
const router = require("express").Router();

router.get("/",getUsers);
router.post("/",createUser);
router.get("/:id",findUser);
router.patch("/", updateUser);
router.delete("/",deleteUser);
router.post("/login",login);

module.exports = router;