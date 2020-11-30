const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, requried: true },
	password: { type: String, required: true },
});

UserSchema.pre("save", async function (next) {
	const user = this;

	try {
		if (!user.isModified("password")) next();

		let hash = await bcrypt.hash(user.password, 13);
		user.password = hash;

		next();
	} catch (e) {
		console.error(e);
		next(e);
	}
});

UserSchema.methods.comparePassword = async function (password) {
	try {
		let result = await bcrypt.compare(password, this.password);

		return result;
	} catch (e) {
		console.error(e);

		return false;
	}
};

module.exports = mongoose.model("user", UserSchema);