const express = require('express');
const { registerAccount, loginAccount, verifyAccount, Logout } = require('../Controller/auth');


const authRouter = express.Router();

authRouter.post('/signup', registerAccount);
authRouter.post('/login', loginAccount);
authRouter.get('/logout', Logout)
authRouter.get('/verify/:id/:token', verifyAccount);

module.exports = authRouter;