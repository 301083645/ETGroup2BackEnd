import React, { Component, useEffect, useState } from "react"
import axios from "axios"
import { Button, Card, Col, Row, Form } from "react-bootstrap"
import { useSelector } from "react-redux"
import { useParams, Navigate, useNavigate } from "react-router-dom"
import { gql, useMutation, useQuery } from "@apollo/client"

const GET_COURSE = gql`
	query Course($id: String!) {
		course(id: $id) {
			id
			courseCode,
			courseName,
			section,
			semester
		}
	}
`

const UPDATE_COURSE = gql`
	mutation UpdateCpourse(
		$courseId: String!
		$courseCode: String!
		$courseName: String!
		$section: String!
		$semester: String!
	) {
		updateCourse(
			courseId: $courseId
			courseCode: $courseCode
			courseName: $courseName
			section: $section
			semester: $semester
		) {
			id
		}
	}
`

function EditCourse() {
	const [course, setCourse] = useState({
		courseCode: "",
		courseName: "",
		section: "",
		semester: ""
	})
	const token = useSelector((state) => state.auth.value.token)

	const navigate = useNavigate()
	const { courseId } = useParams()

	const { loading, error, data: courseData } = useQuery(GET_COURSE, {
		variables: { id: courseId },
		fetchPolicy: "network-only",
		onCompleted: () => {

			setCourse({
				courseCode: courseData.course.courseCode,
				courseName: courseData.course.courseName,
				section: courseData.course.section,
				semester: courseData.course.semester
			})
		}
	})

	const [
		updateCourse,
		{
			data: updateCourseData,
			loading: updateCourseLoading,
			error: updateCourseError
		}
	] = useMutation(UPDATE_COURSE, {
		onCompleted: () => {
			navigate("/admin/courses/all")
		}
	})

	const onInputChange = (e) => {
		setCourse({ ...course, [e.target.name]: e.target.value })
	}
	const handleCreateCourse = async (e) => {
		e.preventDefault()
		updateCourse({
			variables: { ...course, courseId }
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
					Update
				</Button>
			</Form>
		</>
	)
}

export default EditCourse
