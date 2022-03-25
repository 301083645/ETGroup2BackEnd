const graphql = require("graphql")
const User = require("../model/user")
const Course = require("../model/course")
const Student = require("../model/student")
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
	GraphQLNonNull
} = graphql

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

const StudentType = new GraphQLObjectType({
	name: "Student",
	fields: () => ({
		id: {
			type: GraphQLString
		},
		studentNumber: { type: GraphQLString },
		email: { type: GraphQLString },
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		address: { type: GraphQLString },
		city: { type: GraphQLString },
		phoneNumber: { type: GraphQLString },
		program: { type: GraphQLString },
		gitHub: { type: GraphQLString },
		linkedIn: { type: GraphQLString },
		courses: {
			type: new GraphQLList(CourseType),
			async resolve(parent, args) {
				var courses = []
				for (const courseInfo of parent.courses) {
					const course = await Course.findById(courseInfo.course)
					if (course != null) {
						courses.push(course)
					}
				}
				return courses
			}
		}
	})
})

const CourseType = new GraphQLObjectType({
	name: "Course",
	fields: () => ({
		id: {
			type: GraphQLString
		},
		courseCode: { type: GraphQLString },
		courseName: { type: GraphQLString },
		section: { type: GraphQLString },
		semester: { type: GraphQLString },
		students: {
			type: new GraphQLList(StudentType),
			async resolve(parent, args) {
				var students = []
				for (const studentInfo of parent.students) {
					const student = await Student.findById(studentInfo.student)
					if (student != null) {
						students.push(student)
					}
				}
				return students
			}
		}
	})
})

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: () => ({
		student: {
			type: StudentType,
			args: { id: { type: GraphQLString } },
			resolve(parent, args) {
				return Student.findOne({ userId: args.id })
			}
		},
		course: {
			type: CourseType,
			args: { id: { type: GraphQLString } },
			resolve(parent, args) {
				return Course.findById(args.id)
			}
		},
		courses: {
			type: new GraphQLList(CourseType),
			resolve(parent, args) {
				return Course.find()
			}
		},
		students: {
			type: new GraphQLList(StudentType),
			resolve(parent, args) {
				return Student.find()
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
		createCourse: {
			type: CourseType,
			args: {
				courseCode: { type: GraphQLString },
				courseName: { type: GraphQLString },
				section: { type: GraphQLString },
				semester: { type: GraphQLString }
			},
			resolve(parent, args) {
				let course = new Course({
					courseCode: args.courseCode,
					courseName: args.courseName,
					section: args.section,
					semester: args.semester
				})
				return course.save()
			}
		},
		updateCourse: {
			type: CourseType,
			args: {
				courseId: { type: GraphQLString },
				courseCode: { type: GraphQLString },
				courseName: { type: GraphQLString },
				section: { type: GraphQLString },
				semester: { type: GraphQLString }
			},
			async resolve(parent, args) {
				const courseInDb = await Course.findById(args.courseId)
				courseInDb.courseCode = args.courseCode
				courseInDb.section = args.section
				courseInDb.semester = args.semester
				courseInDb.courseName = args.courseName

				return await courseInDb.save()
			}
		},
		deleteCourse: {
			type: CourseType,
			args: {
				courseId: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const course = await Course.findByIdAndDelete(args.courseId)

				const students = await Student.find({
					"courses.course": args.courseId
				})

				for (const student of students) {
					;async (student) => {
						const result = await Student.updateOne(
							{ _id: student._id },
							{
								$pull: {
									courses: { course: args.courseId }
								}
							}
						)
					}
				}
				return course
			}
		},
		dropCourse: {
			type: StudentType,
			args: {
				courseId: { type: new GraphQLNonNull(GraphQLString) },
				studentId: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const student = await Student.findOne({ userId: args.studentId })
				await Course.findByIdAndUpdate(args.courseId, {
					$pull: {
						students: { student: student._id }
					}
				})
				const result = await Student.updateOne(
					{ userId: args.studentId },
					{
						$pull: {
							courses: { course: args.courseId }
						}
					}
				)
				return student
			}
		},
		pickCourse: {
			type: StudentType,
			args: {
				courseId: { type: new GraphQLNonNull(GraphQLString) },
				studentId: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const student = await Student.findOne({ userId: args.studentId })
				student.courses.push({ course: args.courseId })
				result = await student.save()

				const id = student._id
				const course = await Course.findById(args.courseId)
				course.students.push({ student: id })
				await course.save()

				return result
			}
		},
		register: {
			type: UserType,
			args: {
				email: { type: GraphQLString },
				password: { type: GraphQLString },
				role: { type: GraphQLString },
				studentNumber: { type: GraphQLString },
				firstName: { type: GraphQLString },
				lastName: { type: GraphQLString },
				address: { type: GraphQLString },
				city: { type: GraphQLString },
				phoneNumber: { type: GraphQLString },
				program: { type: GraphQLString },
				gitHub: { type: GraphQLString },
				linkedIn: { type: GraphQLString }
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

					if (args.role === "user") {
						var student = new Student()
						student.studentNumber = args.studentNumber
						student.userId = user._id
						student.email = args.email
						student.firstName = args.firstName
						student.lastName = args.lastName
						student.address = args.address
						student.city = args.city
						student.phoneNumber = args.phoneNumber
						student.program = args.program
						student.gitHub = args.gitHub
						student.linkedIn = args.linkedIn

						await student.save()
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
