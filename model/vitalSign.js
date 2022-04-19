//course code, course name, section, semester

const mongoose = require("mongoose")

const VitalSignSchema = new mongoose.Schema({
	bodyTemp: {
		type: String
	},
	heartRate: {
		type: String
	},
	bloodPressure: {
		type: String
	},
	respiratoryRate: {
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

const vitalSign = mongoose.model("vitalSign", VitalSignSchema)

module.exports = vitalSign
