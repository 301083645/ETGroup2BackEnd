import axios from "axios"
import React, { useState } from "react"
import { useDispatch } from "react-redux"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { setLoginSuccess } from "../../features/authSlice"
import { gql, useMutation, useQuery } from "@apollo/client"

const REGISTER = gql`
	mutation Register(
		$email: String!
		$password: String!
		$role: String!
		$firstName: String!
		$lastName: String!
		$studentNumber: String!
		$address: String!
		$city: String!
		$phoneNumber: String!
		$program: String!
		$gitHub: String!
		$linkedIn: String!
	) {
		register(
			email: $email
			password: $password
			studentNumber: $studentNumber
			role: $role
			firstName: $firstName
			lastName: $lastName
			address: $address
			city: $city
			phoneNumber: $phoneNumber
			program: $program
			gitHub: $gitHub
			linkedIn: $linkedIn
		) {
			id
			email
			role
			token
		}
	}
`

function AdminRegister() {
	const [
		register,
		{ data: registerData, loading: registerLoading, error: registerError }
	] = useMutation(REGISTER, {
		onCompleted: (registerData) => {
			dispatch(setLoginSuccess(registerData.register))
			navigate("/home")
		}
	})
	const [user, setUser] = useState({
		password: "",
		email: "",
		role: "admin",
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

	const { email, password, role } = user

	const [login, setLogin] = useState(false)

	//Set dispatch for Redux
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const onInputChange = (e) =>
		setUser({ ...user, [e.target.name]: e.target.value })

	const handleRegister = async (e) => {
		e.preventDefault()

		register({
			variables: user
		})
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
						value={email}
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
						value={password}
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

export default AdminRegister
