const router = require("express").Router();

const {
    getUser,
    deleteUser,
    createUser,
    editUser,
} = require("../controller/user.controller");

router.get("/", getUser);
router.delete("/", deleteUser);
router.post("/", createUser);
router.put("/", editUser);

module.exports = router;
