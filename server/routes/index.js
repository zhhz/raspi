const express_1 = require("express");

const serverName = "Raspberry Pi 0 - Cam";

let router = express_1.Router();

router.get('/', function (req, res, next) {
  res.render('index', { title: serverName });
});

router.get(`/:name`, (req, res) => {
  // Extract the name from the request parameters
  let { name } = req.params;
  // Greet the given name
  res.render('greeter', { name: name });
});

exports.index = router;
