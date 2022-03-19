const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const Student = require("../model/student")
const User = require("../model/user")

//Register User
//@access  Public
router.post("/register", async (req, res) => {
	try {
		var user = new User()

		//Save password
		const salt = await bcrypt.genSalt(10)
		password = await bcrypt.hash(req.body.password, salt)
		user.password = password

		//Save user email
		user.email = req.body.email

		//Save user
		user.role = req.body.role

		user = await user.save()

		if (req.body.role === "user") {
			user.role = "user"
			var student = new Student()
			student.studentNumber = req.body.studentNumber
			student.userId = user._id
			student.email = req.body.email
			student.firstName = req.body.firstName
			student.lastName = req.body.lastName
			student.address = req.body.address
			student.city = req.body.city
			student.phoneNumber = req.body.phoneNumber
			student.program = req.body.program
			student.gitHub = req.body.gitHub
			student.linkedIn = req.body.linkedIn

			console.log(student)
			await student.save()
		}

		const payload = {
			user: {
				id: user.id,
				email: user.email,
				role: user.role
			}
		}
		try {
			token = await jwt.sign(payload, config.get("jwtSecret"), {
				expiresIn: 360000
			})
			const respondUser = {
				_id: user._id,
				email: user.email,
				role: user.role
			}

			return res.json({ user: respondUser, token })
		} catch (err) {
			console.log(err.message)
			return res.status(500).json({ msg: "Token not generated" })
		}
	} catch (err) {
		console.log(err)
		return res.status(500).json({ msg: err.message })
	}
})

//Login
//@Public access
router.post("/login", async (req, res) => {
	const { email, password } = req.body
	try {
		let user = await User.findOne({ email })

		if (user == null) {
			return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] })
		}

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] })
		}

		const payload = {
			user: {
				id: user.id,
				email: user.email,
				role: user.role
			}
		}

		try {
			token = await jwt.sign(payload, config.get("jwtSecret"), {
				expiresIn: 36000000
			})
			const respondUser = {
				_id: user._id,
				email: user.email,
				role: user.role
			}
			return res.json({ user: respondUser, token })
		} catch (err) {
			console.log(err.message)
			return res.status(500).json({ msg: "Token not generated" })
		}
	} catch (err) {
		console.log(err.message)
		return res.status(500).json({ msg: "Server Error" })
	}
})
module.exports = router
