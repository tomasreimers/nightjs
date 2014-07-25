var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.use('/api', require('../controllers/auth'));
router.use('/api', require('../controllers/users'));

module.exports = router;
