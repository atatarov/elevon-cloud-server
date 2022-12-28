const router = require('express').Router();

const { uploadAvatar, getCurrentUser } = require('../controllers/user');

router.post('/user/me/avatar/', uploadAvatar);

router.get('/user/me/', getCurrentUser);

module.exports = router;
