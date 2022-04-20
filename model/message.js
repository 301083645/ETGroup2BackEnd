//course code, course name, section, semester

const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
	description: {
		type: String
	},
	patients: [
		{
			patient: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "patient"
			}
		}
	]
})

const Message = mongoose.model("message", MessageSchema)

module.exports = Message
