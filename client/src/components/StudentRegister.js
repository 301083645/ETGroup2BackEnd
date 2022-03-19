import axios from "axios"
import React, { useState } from "react"
import { useDispatch } from "react-redux"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { setLoginSuccess } from "../features/authSlice"

function StudentRegister() {
	const [user, setUser] = useState({
		password: "",
		email: "",
		role: "user",
		studentNumber: "",
		firstName: "",
		lastName: "",
		address: "",
		city: "",
		phoneNumber: "",
		program: "",
		gitHub: "",
		linkedIn: ""
	})
	const [login, setLogin] = useState(false)

	//Set dispatch for Redux
	const dispatch = useDispatch()

	const onInputChange = (e) =>
		setUser({ ...user, [e.target.name]: e.target.value })
	const navigate = useNavigate()

	const handleRegister = async (e) => {
		e.preventDefault()

		try {
			//Set request header
			const config = {
				headers: {
					"Content-Type": "Application/json"
				}
			}
			//Set request body
			const body = JSON.stringify(user)
			//Make request
			const res = await axios.post(
				`http://localhost:5000/api/auth/register`,
				body,
				config
			)
			dispatch(setLoginSuccess(res.data))

			navigate("/home")
		} catch (error) {
			console.log(error)
		}
	}

	//Redirect if login
	if (login) {
		return <Navigate to="/home" />
	}

	return (
		<>
			<Form onSubmit={(e) => handleRegister(e)}>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>Email address</Form.Label>
					<Form.Control
						type="email"
						placeholder="Enter email"
						name="email"
						value={user.email}
						onChange={(e) => onInputChange(e)}
					/>
					<Form.Text className="text-muted">
						We'll never share your email with anyone else.
					</Form.Text>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Password"
						name="password"
						value={user.password}
						onChange={(e) => onInputChange(e)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicFirstName">
					<Form.Label>First Name</Form.Label>
					<Form.Control
						type="text"
						placeholder="First Name"
						name="firstName"
						value={user.firstName}
						onChange={(e) => onInputChange(e)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicLastName">
					<Form.Label>Last Name</Form.Label>
					<Form.Control
						type="text"
						placeholder="Last Name"
						name="lastName"
						value={user.lastName}
						onChange={(e) => onInputChange(e)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicStudentNumber">
					<Form.Label>Student Number</Form.Label>
					<Form.Control
						type="text"
						placeholder="studentNumber"
						name="studentNumber"
						value={user.studentNumber}
						onChange={(e) => onInputChange(e)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicAddress">
					<Form.Label>address</Form.Label>
					<Form.Control
						type="text"
						placeholder="address"
						name="address"
						value={user.address}
						onChange={(e) => onInputChange(e)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicCity">
					<Form.Label>city</Form.Label>
					<Form.Control
						type="text"
						placeholder="city"
						name="city"
						value={user.city}
						onChange={(e) => onInputChange(e)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicPhoneNumber">
					<Form.Label>phone Number</Form.Label>
					<Form.Control
						type="text"
						placeholder="phoneNumber"
						name="phoneNumber"
						value={user.phoneNumber}
						onChange={(e) => onInputChange(e)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicGitHub">
					<Form.Label>Git Hub</Form.Label>
					<Form.Control
						type="text"
						placeholder="gitHub"
						name="gitHub"
						value={user.gitHub}
						onChange={(e) => onInputChange(e)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicLinkedIn">
					<Form.Label>linkedIn</Form.Label>
					<Form.Control
						type="text"
						placeholder="linkedIn"
						name="linkedIn"
						value={user.linkedIn}
						onChange={(e) => onInputChange(e)}
					/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="formBasicProgram">
					<Form.Label>program</Form.Label>
					<Form.Control
						type="text"
						placeholder="program"
						name="program"
						value={user.program}
						onChange={(e) => onInputChange(e)}
					/>
				</Form.Group>
				<Button variant="primary" type="submit">
					Register
				</Button>
			</Form>
		</>
	)
}

export default StudentRegister
