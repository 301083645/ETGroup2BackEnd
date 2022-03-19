//course code, course name, section, semester

const mongoose = require("mongoose")

const CourseSchema = new mongoose.Schema({
	courseCode: {
		type: String
	},
	courseName: {
		type: String
	},
	section: {
		type: String
	},
	semester: {
		type: String
	},
	students: [
		{
			student: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "student"
			}
		}
	]
})

const Course = mongoose.model("course", CourseSchema)

module.exports = Course
