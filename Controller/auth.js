const sendEmail = require("../Middleware/nodemailer");
const { isStrongPassword } = require("validator");
const userModel = require("../Model/users");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
require('dotenv').config();


const registerAccount = async(req, res)=>{
    try {
		if (req.body.email) {
			req.body.email = req.body.email.toLowerCase();
		}

		const {email, password, firstName, lastName} = req.body;

		const passwordSecurityOptions = {
			minLength: 6,
			minLowercase: 0,
			minUppercase: 0,
			minNumbers: 0,
			minSymbols: 0,
		};

		const requiredKeys = ['firstName', 'lastName', 'email', 'password'];
		let unavailableKeys = [];
		requiredKeys.forEach(key => {
			if (!Object.keys(req.body).includes(key)) {
				unavailableKeys.push(key);
			}
		});
		if (unavailableKeys.length > 0) {
			throw new Error(
				`Please provide all required keys '${[unavailableKeys]}'`
			);
		}

		if (!isStrongPassword(password, passwordSecurityOptions)) {
			throw new Error('Please input a stronger password\n at least 6 digits');
		} else if (password) {
			const salt = await bcrypt.genSaltSync(10);
			const hash = await bcrypt.hashSync(password, salt);
			req.body.password = hash;
		}

		let user = await userModel.findOne({email: req.body.email});
		if (user) throw new Error('User with given email already exist!');

		user = await userModel.create({
			email,
			password: req.body.password,
			firstName,
			lastName,
			isVerified: false,
		});

		const id = user._id.toString();
		const token = jwt.sign(id, process.env.JWT_SECRET);
		user.token = token;
		await user.save();

		const message = String.raw`
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0"
					/>
					<title>Email Verification</title>
					<style>
						a {
							background-color: aqua;
							color: #FFFFFF !important;
							margin: 30px 0;
							padding: 15px;
							border-radius: 8px;
							display: inline-block;
			                text-decoration: none;
						}
						a:active{
							color: #FFFFFF;

						}
					</style>
				</head>
				<body>
					<h1>Verify Your Email Address</h1>

					<p>
						Kindly click on the button below to verify your email address
						<br />
						<a href=${`${process.env.localhost_url}/auth/verify/${id}/${token}`}
							>Click button to verify your account</a
						>
						<br />
						Please click on the button to proceed with your account creation. 
						<br />
						<br />
						If you did not initiate this verification, kindly ignore this email and
						avoid sharing this code with a third party
					</p>
				</body>
			</html>
		`;

		await sendEmail(
			process.env.my_email,
			'',
			email,
			message,
			'Verify Your Email Address to Continue'
		);



		res.status(200).json({
			success: true,
			data: {
				email,
				firstName,
				lastName,
				isVerified: false,
				token,
			},
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({message: error.message, success: false});
	}
}; 


const loginAccount = async (req, res) => {
	try {
		if (req.body.email) {
			req.body.email = req.body.email.toLowerCase();
		}
		const {email, password} = req.body;
		if (!email || !password) {
			throw new Error('Please provide your email and password');
		}
		const result = await userModel.findOne({email});

		if (!result) throw new Error('Invalid Credentials');

		const compare = await bcrypt.compare(password, result.password);

		if (!compare) throw new Error('Invalid Credentials');
		else {
			const {_id, email, first_name, last_name, isVerified} = result;
			const id = _id.toString();
			const token = jwt.sign(id, process.env.JWT_SECRET);

			res.status(200).json({
				success: true,
				data: {
					id: _id,
					email,
					first_name,
					last_name,
					isVerified,
					token,
				},
			});
		}
	} catch (error) {
		console.log(error.message);
		res.status(401).json({message: error.message, success: false});
	}
};


const Logout = async(req, res)=>{
    req.logout(function(err){
        if(err){
            return res.json(err)
        }
        res.json({message: "Logout successful"})
    })
}


const verifyAccount = async (req, res) => {
	try {
		const user = await userModel.findOne({
			_id: req.params.id,
			token: req.params.token,
		});
		if (!user)
			return res.status(400).send({success: false, error: 'Invalid link'});

		await userModel.updateOne({_id: user._id}, {isVerified: true, token: null});

		res.status(200).json({
			success: true,
			data: {},
			message: 'Email account verified successfully',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({error: 'Server Error'});
	}
};


module.exports = {
    registerAccount,
    loginAccount,
    Logout,
	verifyAccount
}