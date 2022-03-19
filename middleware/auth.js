const Course = require("../model/course")
const config = require("config")
const jwt = require("jsonwebtoken")
const Student = require("../model/student")

const authenticate = (req, res, next) => {
	var token
	//console.log(res.headers)
	if (
		req.headers.authorization &&
		req.headers.authorization.split(" ")[0] === "Bearer"
	) {
		token = req.headers.authorization.split(" ")[1]
	}
	//console.log(token)

	//Check if no token
	if (!token) {
		return res.status(401).json({ msg: "No token" })
	}
	try {
		const decoded = jwt.verify(token, config.get("jwtSecret"))

		req.user = decoded.user
		//console.log(req.user)
		next()
	} catch (err) {
		res.status(401).json({ msg: "Token not valid" })
	}
}

const authorizeAdmin = (req, res, next) => {
	var token
	if (
		req.headers.authorization &&
		req.headers.authorization.split(" ")[0] === "Bearer"
	) {
		token = req.headers.authorization.split(" ")[1]
	}

	//Check if no token
	if (!token) {
		return res.status(401).json({ msg: "No token" })
	}
	try {
		const decoded = jwt.verify(token, config.get("jwtSecret"))
		console.log(decoded.user.role)
		if (decoded.user.role != "admin") {
			return res.status(403).json({ msg: "User has no authorization" })
		}

		next()
	} catch (err) {
		res.status(401).json({ msg: "Token not valid" })
	}
}

const authorizeStudent = async (req, res, next) => {
	var token
	if (
		req.headers.authorization &&
		req.headers.authorization.split(" ")[0] === "Bearer"
	) {
		token = req.headers.authorization.split(" ")[1]
	}

	//Check if no token
	if (!token) {
		return res.status(401).json({ msg: "No token" })
	}
	try {
		const decoded = jwt.verify(token, config.get("jwtSecret"))
		console.log(decoded.user.role)
		if (decoded.user.role != "user") {
			return res.status(403).json({ msg: "User has no authorization" })
		}
		const student = await Student.findOne({ userId: decoded.user.id })
		req.user.studentId = student._id

		next()
	} catch (err) {
		res.status(401).json({ msg: "Token not valid" })
	}
}

module.exports = { authenticate, authorizeAdmin, authorizeStudent }
