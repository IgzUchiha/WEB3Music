const express = require("express");
const router = express.Router();

// different model routers

router.use('/songs', require('./songs'));

module.exports = router;
