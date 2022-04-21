//course code, course name, section, semester

const mongoose = require("mongoose")

const AlertSchema = new mongoose.Schema({
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

const Alert = mongoose.model("alert", AlertSchema)

module.exports = Alert
