import { useQuery, gql } from "@apollo/client"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Button, Card, Col, Row } from "react-bootstrap"
import { useSelector } from "react-redux"

const GET_ALL_Students = gql`
	{
		students {
			firstName
			lastName
			studentNumber
			program
			email
			address
			city
			linkedIn
			gitHub
		}
	}
`

function AdminAllStudents() {
	const [students, setStudents] = useState([])
	const token = useSelector((state) => state.auth.value.token)
	const {
		loading: loadingStudents,
		error: errorStudents,
		data: dataStudents
	} = useQuery(GET_ALL_Students, {
		fetchPolicy: "network-only",
		onCompleted: () => {
			setStudents(dataStudents.students)
		}
	})
	return (
		<div>
			<h2>Student list</h2>
			<Row xs={1} md={3} className="g-4">
				{students.map((student) => (
					<Col>
						<Card>
							<Card.Header as="h5">
								Name: {student.firstName + " " + student.lastName}
							</Card.Header>
							<Card.Body>
								<Card.Title>Student Number: {student.studentNumber}</Card.Title>
								<Card.Text>Program: {student.program}</Card.Text>
								<Card.Text>Email: {student.email}</Card.Text>
								<Card.Text>
									Address: {student.address + " " + student.city}
								</Card.Text>
								<Card.Text>GitHub: {student.gitHub}</Card.Text>
								<Card.Text>LinkedIn: {student.linkedIn}</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>
		</div>
	)
}

export default AdminAllStudents
