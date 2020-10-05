const { getGuests } = require("./GuestController");
const router = require("express").Router();

router.get("/",getGuests);

module.exports = router;