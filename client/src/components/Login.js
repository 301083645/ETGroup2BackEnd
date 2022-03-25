import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { Link, Navigate, Redirect } from "react-router-dom"
import { gql, useMutation, useQuery } from "@apollo/client"
import { useDispatch } from "react-redux"
import { setLoginSuccess } from "../features/authSlice"

const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			id
			email
			role
			token
		}
	}
`
function Login() {
	const navigate = useNavigate()

	const [credential, setCredential] = useState({
		email: "",
		password: ""
	})
	const { email, password } = credential

	const [hasWrongCredential, setHasWrongCredential] = useState(false)

	const [alert, setAlert] = useState()

	const [show, setShow] = useState(false)
	//Set dispatch for Redux
	const dispatch = useDispatch()

	useEffect((props) => {
		console.log(props)
		if (props != null && props.alert != null) {
			console.log(props)
			setAlert(props.alert)
			setShow(true)
		}
	}, [])

	const handleClose = () => setShow(false)

	const onInputChange = (e) =>
		setCredential({ ...credential, [e.target.name]: e.target.value })

	const [
		login,
		{ data: loginData, loading: loginLoading, error: loginError }
	] = useMutation(LOGIN, {
		onCompleted: (loginData) => {
			console.log(loginData)
			dispatch(setLoginSuccess(loginData.login))

				navigate("/home")

		}
	})

	const handleLogin = async (e) => {
		e.preventDefault()
		login({
			variables: { email, password }
		})
	}

	//
	return (
		<>
			<Form onSubmit={(e) => handleLogin(e)}>
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
					Login
				</Button>
			</Form>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Modal heading</Modal.Title>
				</Modal.Header>
				<Modal.Body>{alert}</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default Login
