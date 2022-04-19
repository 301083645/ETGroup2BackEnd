const graphql = require("graphql")
const User = require("../model/user")
const VitalSign = require("../model/vitalSign")
const Patient = require("../model/patient")
const Message = require("../model/message")
const jwt = require("jsonwebtoken")
const config = require("config")
const bcrypt = require("bcryptjs/dist/bcrypt")
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLFloat
} = graphql

const MessageType = new GraphQLObjectType({
	name:"Message",
	fields:()=> ({
		id:{
			type:GraphQLString
		},
		description:{ type : GraphQLString}
	})
})

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: {
			type: GraphQLString
		},
		email: { type: GraphQLString },
		token: { type: GraphQLString },
		role: {
			type: GraphQLString
		}
	})
})

const PatientType = new GraphQLObjectType({
	name: "Patient",
	fields: () => ({
		id: {
			type: GraphQLString
		},
		patientNumber: { type: GraphQLString },
		email: { type: GraphQLString },
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		address: { type: GraphQLString },
		city: { type: GraphQLString },
		phoneNumber: { type: GraphQLString },
		vitalSigns: {
			type: new GraphQLList(VitalSignType),
			async resolve(parent, args) {
				var vitalSigns = []
				for (const vitalSignInfo of parent.vitalSigns) {
					const vitalSign = await VitalSign.findById(vitalSignInfo.vitalSign)
					if (vitalSign != null) {
						vitalSigns.push(vitalSign)
					}
				}
				return vitalSigns
			}
		},
		messages:{
			type: new GraphQLList(VitalSignType),
			async resolve(parent, args) {
				var messages = []
				for (const messageInfo of parent.messages) {
					const message = await Message.findById(messageInfo.message)
					if (message != null) {
						messages.push(message)
					}
				}
				return messages
			}
		}
	})
})

const VitalSignType = new GraphQLObjectType({
	name: "VitalSign",
	fields: () => ({
		id: {
			type: GraphQLString
		},
		bodyTemp: { type: GraphQLString },
		heartRate: { type: GraphQLString },
		bloodPressure: { type: GraphQLString },
		respiratoryRate: { type: GraphQLString },
		patients: {
			type: new GraphQLList(PatientType),
			async resolve(parent, args) {
				var patients = []
				for (const patientInfo of parent.patients) {
					const patient = await Patient.findById(patientInfo.patient)
					if (patient != null) {
						patients.push(patient)
					}
				}
				return patients
			}
		}
	})
})

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: () => ({
		patient: {
			type: PatientType,
			args: { id: { type: GraphQLString } },
			resolve(parent, args) {
				return Patient.findOne({ userId: args.id })
			}
		},
		patientVitalSign: {
			type: PatientType,
			args: { id: { type: GraphQLString } },
			resolve(parent, args) {
				return Patient.findById(args.id)
			}
		},
		message:{
			type: MessageType,
			args:{id:{type: GraphQLString}},
			resolve(parent,args){
				return Message.findById(args.id)
			}
		},
		vitalSign: {
			type: VitalSignType,
			args: { id: { type: GraphQLString } },
			resolve(parent, args) {
				return VitalSign.findById(args.id)
			}
		},
		vitalSigns: {
			type: new GraphQLList(VitalSignType),
			resolve(parent, args) {
				return VitalSign.find()
			}
		},
		messages:{
			type: new GraphQLList(MessageType),
			resolve(parent,args){
				return Message.find()
			}
		},
		patients: {
			type: new GraphQLList(PatientType),
			resolve(parent, args) {
				return Patient.find()
			}
		},
		header: {
			type: GraphQLString,
			resolve(parent, args, context) {
				console.log(context.user)
				//return context
			}
		}
	})
})

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		createMessage:{
			type:MessageType,
			args:{
				description:{type:GraphQLString}
			},
			resolve(parent, args){
				let message = new Message({
					description:args.description
				})
				return message.save()
			}
		},
		
		createVitalSign: {
			type: VitalSignType,
			args: {
				bodyTemp: { type: GraphQLString },
				heartRate: { type: GraphQLString },
				bloodPressure: { type: GraphQLString },
				respiratoryRate: { type: GraphQLString }
			},
			resolve(parent, args) {
				let vitalSign = new VitalSign({
					bodyTemp: args.bodyTemp,
					heartRate: args.heartRate,
					bloodPressure: args.bloodPressure,
					respiratoryRate: args.respiratoryRate
				})
				return vitalSign.save()
			}
		},
		updateVitalSign: {
			type: VitalSignType,
			args: {
				vitalSignId:{type: GraphQLString },
				bodyTemp: { type: GraphQLString },
				heartRate: { type: GraphQLString },
				bloodPressure: { type: GraphQLString },
				respiratoryRate: { type: GraphQLString }
			},
			async resolve(parent, args) {
				const vitalSignInDb = await VitalSign.findById(args.vitalSignId)
				vitalSignInDb.bodyTemp = args.bodyTemp
				vitalSignInDb.heartRate = args.heartRate
				vitalSignInDb.bloodPressure = args.bloodPressure
				vitalSignInDb.respiratoryRate = args.respiratoryRate

				return await vitalSignInDb.save()
			}
		},

		

		deleteVitalSign: {
			type: VitalSignType,
			args: {
				vitalSignId: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const vitalSign = await VitalSign.findByIdAndDelete(args.vitalSignId)

				const patients = await Patient.find({
					"vitalSigns.vitalSign": args.vitalSignId
				})

				for (const patient of patients) {
					;async (patient) => {
						const result = await Patient.updateOne(
							{ _id: patient._id },
							{
								$pull: {
									vitalSigns: { vitalSign: args.vitalSignId }
								}
							}
						)
					}
				}
				return vitalSign
			}
		},
		dropVitalSign: {
			type: VitalSignType,
			args: {
				vitalSignId: { type: new GraphQLNonNull(GraphQLString) },
				patientId: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const patient = await Patient.findOne({ userId: args.patientId })
				await VitalSign.findByIdAndUpdate(args.vitalSignId, {
					$pull: {
						patients: { patient: patient._id }
					}
				})
				const result = await Patient.updateOne(
					{ userId: args.patientId },
					{
						$pull: {
							vitalSigns: { vitalSign: args.vitalSignId }
						}
					}
				)
				return patient
			}
		},
		assignVitalSign: {
			type: PatientType,
			args: {
				vitalSignId: { type: new GraphQLNonNull(GraphQLString) },
				patientId: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const patient = await Patient.findOne({ userId: args.patientId })
				patient.vitalSigns.push({ vitalSign: args.vitalSignId })
				result = await patient.save()

				const id = patient._id
				const vitalSign = await VitalSign.findById(args.vitalSignId)
				vitalSign.patients.push({ patient: id })
				await vitalSign.save()

				return result
			}
		},
		register: {
			type: UserType,
			args: {
				email: { type: GraphQLString },
				password: { type: GraphQLString },
				role: { type: GraphQLString },
				patientNumber: { type: GraphQLString },
				firstName: { type: GraphQLString },
				lastName: { type: GraphQLString },
				address: { type: GraphQLString },
				city: { type: GraphQLString },
				phoneNumber: { type: GraphQLString }
			},
			async resolve(parent, args) {
				const userInDb = await User.findOne({ email: args.email })
				if (userInDb != null) {
					throw new Error("Email exists. Use another one or login")
				}

				try {
					var user = new User()

					//Save password
					const salt = await bcrypt.genSalt(10)
					password = await bcrypt.hash(args.password, salt)
					user.password = password

					//Save user email
					user.email = args.email

					//Save user
					user.role = args.role

					user = await user.save()

					if (args.role === "patient") {
						var patient = new Patient()
						patient.patientNumber = args.patientNumber
						patient.userId = user._id
						patient.email = args.email
						patient.firstName = args.firstName
						patient.lastName = args.lastName
						patient.address = args.address
						patient.city = args.city
						patient.phoneNumber = args.phoneNumber
				

						await patient.save()
					}

					const payload = {
						user: {
							id: user._id,
							email: user.email,
							role: user.role
						}
					}
					token = await jwt.sign(payload, config.get("jwtSecret"), {
						expiresIn: 360000
					})

					user.token = token

					return user
				} catch (err) {
					console.log(err)
				}
			}
		},
		login: {
			type: UserType,
			args: {
				email: { type: GraphQLString },
				password: { type: GraphQLString }
			},
			async resolve(parent, args) {
				let user = await User.findOne({ email: args.email })

				if (user == null) {
					throw new Error("Invalid credentials")
				}

				const isMatch = await bcrypt.compare(args.password, user.password)
				if (!isMatch) {
					throw new Error("Invalid credentials")
				}

				const payload = {
					user: {
						id: user.id,
						email: user.email,
						role: user.role
					}
				}

				token = await jwt.sign(payload, config.get("jwtSecret"), {
					expiresIn: 360000
				})

				user.token = token

				return user
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})
