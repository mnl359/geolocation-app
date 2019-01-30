const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Index');
});

router.get('/signin', (req, res) => {
    res.send('Sign in');
});

router.get('/signup', (req, res) => {
    res.send('Sign up');
});

module.exports = router;
