import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { Link, Navigate,Redirect } from "react-router-dom"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setLoginSuccess } from "../features/authSlice"

function Login(props) {

	const navigate = useNavigate()

	const [credential, setCredential] = useState({
		email: "",
		password: ""
	})
	const { email, password } = credential

	const [login, setLogin] = useState(false)

  const [hasWrongCredential, setHasWrongCredential] = useState(false)
  
  const [alert,setAlert] = useState()

  const [show,setShow] = useState(false)
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

	const handleLogin = async (e) => {
		e.preventDefault()

		const newUser = {
			email,
			password
		}
		try {
			//Set request header
			const config = {
				headers: {
					"Content-Type": "Application/json"
				}
			}
			//Set request body
			const body = JSON.stringify(newUser)
			//Make request
			const res = await axios.post(
				`http://localhost:5000/api/auth/login`,
				body,
				config
      )
      console.log(res.data)
			dispatch(setLoginSuccess(res.data))

			setLogin(true)
		} catch (error) {
			console.log(error)
		}
	}

	//Redirect if login
	if (login) {
		return <Navigate to="/home" />
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
