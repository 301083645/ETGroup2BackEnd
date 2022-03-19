import React, { Component, useEffect, useState } from "react"
import axios from "axios"
import { Button, Card, Col, Row, Form } from "react-bootstrap"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
const { gql, useQuery, useMutation } = require("@apollo/client")

const CREATE_COURSE = gql`
	mutation CreateCourse(
		$courseCode: String!
		$courseName: String!
		$section: String!
		$semester: String!
	) {
		createCourse(
			courseCode: $courseCode
			courseName: $courseName
			section: $section
			semester: $semester
		) {
			id
		}
	}
`

function AdminCreateCourse() {
	const [course, setCourse] = useState({
		courseCode: "",
		courseName: "",
		section: "",
		semester: ""
	})
	const token = useSelector((state) => state.auth.value.token)

	const navigate = useNavigate()

	const [
		createCourse,
		{
			data: cteateCourseData,
			loading: createCourseLoading,
			error: createCourseError
		}
	] = useMutation(CREATE_COURSE, {
		onCompleted: () => {
			navigate("/admin/courses/all")
		}
	})

    const onInputChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value })
    }
	
	const handleCreateCourse = async (e) => {
		e.preventDefault()
		createCourse({
			variables: course
		})
	}

	return (
		<>
			<Form onSubmit={(e) => handleCreateCourse(e)}>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>courseCode</Form.Label>
					<Form.Control
						type="txt"
						placeholder="courseCode"
						name="courseCode"
						value={course.courseCode}
						onChange={(e) => onInputChange(e)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>courseName</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter course Name"
						name="courseName"
						value={course.courseName}
						onChange={(e) => onInputChange(e)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>Section</Form.Label>
					<Form.Control
						type="text"
						placeholder="section"
						name="section"
						value={course.section}
						onChange={(e) => onInputChange(e)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>semester</Form.Label>
					<Form.Control
						type="semester"
						placeholder="Enter semester"
						name="semester"
						value={course.semester}
						onChange={(e) => onInputChange(e)}
					/>
				</Form.Group>
				<Button variant="primary" type="submit">
					Create
				</Button>
			</Form>
		</>
	)
}

export default AdminCreateCourse
