const express_1 = require("express");
let router = express_1.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

exports.users = router;
