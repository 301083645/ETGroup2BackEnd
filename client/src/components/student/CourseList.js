import React, { Component, useEffect, useState } from "react"
import axios from "axios"
import { Button, Card, Col, Row, Modal, Table } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { setLocalUserLogin } from "../../features/authSlice"

const { gql, useQuery, useMutation } = require("@apollo/client")

const GET_ALL_Courses = gql`
	{
		courses {
			id
			courseCode
			courseName
			section
			semester
			students {
				firstName
				lastName
			}
		}
	}
`
const PICK_COURSE = gql`
	mutation PickCourse($courseId: String!,$studentId:String!) {
		pickCourse(courseId: $courseId,studentId:$studentId) {
			id
		}
	}
`

function CourseList() {
	const [courses, setCourses] = useState([])
	const [selectedCourse, setSelectedCourse] = useState()

	const userId = useSelector(state=>state.auth.value.userId)

	const {
		loading: loadingCourses,
		error: errorCourses,
		data: coursesData
	} = useQuery(GET_ALL_Courses, {
		fetchPolicy: "network-only",
		onCompleted: () => {
			console.log(coursesData)
			setCourses(coursesData.courses)
		}
	})

	const [
		pickCourse,
		{
			data: deleteCourseData,
			loading: deleteCourseLoading,
			error: deleteCourseError
		}
	] = useMutation(PICK_COURSE)

	const [show, setShow] = useState(false)

	const handleClose = () => setShow(false)
	const handleShow = async (e) => {
		const selectedCourseId = e.target.value
		
		const selected = courses.filter(course => course.id === selectedCourseId)
		setSelectedCourse(selected[0])
		console.log(selected)

		setShow(true)
	}

	const handlePickCourse = async (e) => {
		const courseId = e.target.value
		console.log(userId)

		pickCourse({
			variables: {
				courseId,
				studentId:userId
			}
		})

		handleClose()
	}

	return (
		<div>
			<h2> Courses</h2>

			{courses.length !== 0 && (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Course Code</th>
							<th>Course Name</th>
							<th>Section</th>
							<th>Semester</th>
							<th>Pick</th>
						</tr>
					</thead>
					<tbody>
						{courses.map((course) => (
							<tr>
								<td>{course.courseCode}</td>
								<td>{course.courseName}</td>
								<td>{course.section}</td>
								<td>{course.semester}</td>

								<td>
									{" "}
									<Button
										variant="primary"
										value={course.id}
										onClick={(e) => handleShow(e)}
									>
										Pick Course
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}

			{selectedCourse != null && (
				<Modal show={show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Course Code: {selectedCourse.courseCode}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>Course Name: {selectedCourse.courseName}</p>
						<p>Course Section: {selectedCourse.section}</p>
						<p>Course Semester: {selectedCourse.semester}</p>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
						<Button
							value={selectedCourse.id}
							variant="primary"
							onClick={(e) => handlePickCourse(e)}
						>
							Pick Course
						</Button>
					</Modal.Footer>
				</Modal>
			)}
		</div>
	)
}

export default CourseList
