var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
    res.render('watermark');
});
router.get('/source', function(req, res) {
    res.render('details/source.html');
});
router.get('/visiblewtmk', function(req, res) {
    res.render('details/visiblewtmk.html');
});
router.get('/digitimg', function(req, res) {
    res.render('details/digitimg.html');
});
router.get('/digitwm', function(req, res) {
    res.render('details/digitwm.html');
});
module.exports = router;