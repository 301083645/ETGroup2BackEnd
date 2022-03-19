const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		match: [/.+\@.+\..+/, "Please fill a valid email address"]
	},
	password: { type: String },
	role: {
		type: String,
		required: true,
		enum: {
			values: ["admin", "user"],
			message: "{VALUE} is not supported"
		}
	}
})

const User = mongoose.model("user", UserSchema)

module.exports = User
