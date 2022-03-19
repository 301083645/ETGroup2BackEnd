//student number, password, first name, last name, address, city, phone number, email, program

const mongoose = require("mongoose")

const StudentSchema = new mongoose.Schema({
	studentNumber: {
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
	program: {
		type: String
	},
	gitHub: {
		type: String
	},
	linkedIn: {
		type: String
	},
	courses: [
		{
			course: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "course"
			}
		}
	]
})

// Set the 'fullname' virtual property
StudentSchema.virtual("fullName")
	.get(function () {
		return this.firstName + " " + this.lastName
	})
	.set(function (fullName) {
		const splitName = fullName.split(" ")
		this.firstName = splitName[0] || ""
		this.lastName = splitName[1] || ""
	})

const Student = mongoose.model("student", StudentSchema)

module.exports = Student
