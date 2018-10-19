const router = require('express').Router();
const userController = require('../controllers/user.controller');
const jwtValidation = require('../middlewares/jwt-local.middleware').verifyToken;
const signUpValidation = require('../middlewares/sign-up.middleware').verifyToken;
const multer = require('multer');
const request = require('request');
const fetch = require('node-fetch');
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
})
const upload = multer({storage: storage});

router.post('/signup', signUpValidation, upload.single('avatar'), userController.saveImage, userController.signUp)
router.post('/emailsList', userController.emailsList)
router.post('/signin', userController.signIn);
router.post('/sendEmails', userController.sendEmails);
router.use(jwtValidation);
router.get('/avatar', userController.getAvatar);

module.exports = router;