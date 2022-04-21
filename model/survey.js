//course code, course name, section, semester

const mongoose = require("mongoose")

const SurveySchema = new mongoose.Schema({
	question1: {
		type: String
	},
	answer1: {
		type: String
	},
    question2: {
		type: String
	},
	answer2: {
		type: String
	},
    question3: {
		type: String
	},
	answer3: {
		type: String
	},
    question4: {
		type: String
	},
	answer4: {
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

const survey = mongoose.model("survey", SurveySchema)

module.exports = survey
