//student number, password, first name, last name, address, city, phone number, email, program

const mongoose = require("mongoose")

const PatientSchema = new mongoose.Schema({
	patientNumber: {
		type: String,
		required: true
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user"
	},
	email: {
		type: String,
		unique: true,
		match: [/.+\@.+\..+/, "Please fill a valid email address"]
	},
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	address: {
		type: String
	},
	city: {
		type: String
	},
	phoneNumber: {
		type: String
	},
	
	vitalSigns: [
		{
			vitalSign: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "vitalSign"
			}
		}
	],

	messages: [
		{
			message: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "message"
			}
		}
	],

	alerts: [
		{
			alert: {
			type: mongoose.Schema.Types.ObjectId,
				ref: "alert"
			}
		}
	],

	surveys: [
		{
			survey: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "survey"
			}
		}
	],
	
})

// Set the 'fullname' virtual property
PatientSchema.virtual("fullName")
	.get(function () {
		return this.firstName + " " + this.lastName
	})
	.set(function (fullName) {
		const splitName = fullName.split(" ")
		this.firstName = splitName[0] || ""
		this.lastName = splitName[1] || ""
	})

const Patient = mongoose.model("patient", PatientSchema)

module.exports = Patient
