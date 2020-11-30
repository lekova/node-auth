const jwt = require("jsonwebtoken");

const User = require("../models/User");

const signup = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (!user) {
			let newUser = new User({ name, email, password });

			await newUser.save();

			return res.status(200).json({ msg: "user successfully created" });
		}

		return res
			.status(422)
			.json({ errors: ["this email is already registered "] });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ errors: ["some error occured"] });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (!user) return res.status(422).json({ errors: ["no such user exists"] });

		if (await user.comparePassword(password)) {
			const token = jwt.sign({ id: user._id }, process.env.SECRET, {
				expiresIn: "24h",
			});

			return res.status(200).json({ msg: "user logged in", token });
		}

		return res.status(403).json({ errors: ["invalid password"] });
	} catch (e) {
		console.error(e);
		res.staus(500).json({ errors: ["some error occured"] });
	}
};

const profile = async (req, res) => {
	let token = req.header("X-Auth");

	try {
		if (!token)
			return res.status(403).json({ errors: ["unauthorized access"] });

		let decoded = jwt.verify(token, process.env.SECRET);

		let user = await User.findById(decoded.id, "name email");

		if (!user) return res.status(403).json({ errors: ["unauthorized"] });

		return res.status(200).json({ user });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ errors: ["some error occured"] });
	}
};

module.exports = {
	login,
	signup,
	profile,
};