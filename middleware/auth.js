const VitalSign = require("../model/vitalSign")
const config = require("config")
const jwt = require("jsonwebtoken")
const Patient = require("../model/patient")

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
		if (decoded.user.role != "nurse") {
			return res.status(403).json({ msg: "User has no authorization" })
		}

		next()
	} catch (err) {
		res.status(401).json({ msg: "Token not valid" })
	}
}

const authorizePatient = async (req, res, next) => {
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
		if (decoded.user.role != "patient") {
			return res.status(403).json({ msg: "User has no authorization" })
		}
		const patient = await Patient.findOne({ userId: decoded.user.id })
		req.user.patientId = patient._id

		next()
	} catch (err) {
		res.status(401).json({ msg: "Token not valid" })
	}
}

module.exports = { authenticate, authorizeAdmin, authorizePatient }