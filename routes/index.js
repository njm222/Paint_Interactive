let express = require('express');
let router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Paint Interactive' });
});

/* GET data page. */
router.get('/data', function(req, res, next) {
  let obj = JSON.parse(fs.readFileSync('./test.json', 'utf8'));
  res.json(obj);
});

module.exports = router;
