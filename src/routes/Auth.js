const express = require("express");
const { check, validationResult } = require("express-validator");

const { login, signup, profile } = require("../controller/AuthController");

const router = express.Router();

// /api/auth/signup
router.post(
	"/signup",
	[
		check("name")
			.isLength({ min: 3 })
			.withMessage("the name must have minimum length of 3")
			.trim(),

		check("email")
			.isEmail()
			.withMessage("invalid email address")
			.normalizeEmail(),

		check("password")
			.isLength({ min: 8, max: 25 })
			.withMessage("your password should have min and max length between 8-25")
			.matches(/\d/)
			.withMessage("your password should have at least one number")
			.matches(/[!@#$%^&*(),.?":{}|<>_]/)
			.withMessage("your password should have at least one sepcial character"),

		check("confirmPassword").custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error("confirm password does not match");
			}
			return true;
		}),
	],
	(req, res, next) => {
		const error = validationResult(req).formatWith(({ msg }) => msg);

		if (!error.isEmpty()) return res.status(422).json({ error: error.array() });

		next();
	},
	signup
);

// /api/auth/login
router.post(
	"/login",
	[
		check("email").isEmail().withMessage("invalid message").normalizeEmail(),

		check("password")
			.isLength({ min: 8, max: 25 })
			.withMessage("invalid password"),
	],
	(req, res, next) => {
		let error = validationResult(req).formatWith(({ msg }) => msg);

		if (!error.isEmpty())
			return res.status(422).json({ errors: error.array() });

		next();
	},
	login
);

// /api/auth/profile
router.get("/profile", profile);

module.exports = router;