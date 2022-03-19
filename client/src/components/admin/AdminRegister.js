import axios from "axios"
import React, { useState } from "react"
import { useDispatch } from "react-redux"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { setLoginSuccess } from "../../features/authSlice"

function AdminRegister() {
	const [user, setUser] = useState({
		password: "",
		email: "",
		role: "admin"
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
