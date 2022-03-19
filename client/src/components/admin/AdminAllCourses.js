import React, { Component, useEffect, useState } from "react"
import axios from "axios"
import { Button, Card, Col, Row, Table } from "react-bootstrap"
import { Navigate, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
const { gql, useQuery, useMutation } = require("@apollo/client")

const GET_ALL_Courses = gql`
	{
		courses {
			id
			courseCode
			courseName
			section
			semester
			students{
				firstName
				lastName
			}
		}
	}
`

const DELETE_COURSE = gql`
	mutation DeleteCourse($courseId: String!) {
		deleteCourse(courseId: $courseId) {
			id
		}
	}
`

function AdminAllCourses() {
	const {
		loading: loadingCourses,
		error: errorCourses,
		data: coursesData
	} = useQuery(GET_ALL_Courses, {
		fetchPolicy: "network-only",
		onCompleted:()=>{setCourses(coursesData.courses)}
	})

	const [
		deleteCourse,
		{
			data: deleteCourseData,
			loading: deleteCourseLoading,
			error: deleteCourseError
		}
	] = useMutation(DELETE_COURSE)
	useEffect(() => {
		if (deleteCourseData) {
			const newCourses = courses.filter(function (item) {
				return item.id !== deleteCourseData.deleteCourse.id
			})
			
			setCourses(newCourses)
		}
	}, [deleteCourseData])

	const [courses, setCourses] = useState([])

	const [goEdit, setGoEdit] = useState(false)
	const [selectedCourse, setSelectedCourse] = useState("")

	const token = useSelector((state) => state.auth.value.token)

	const navigate = useNavigate()
	const handleEdit = (e) => {
		e.preventDefault()
		const courseId = e.target.value
		console.log(courseId)
		navigate(`/admin/courses/edit/${courseId}`)
	}

	const handleDelete = async (e) => {
		e.preventDefault()
		const courseId = e.target.value
		console.log(courseId)
		deleteCourse({
			variables: {
				courseId
			}
		})
	}

	return (
		<div>
			{courses.length !== 0 && (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Course Code</th>
							<th>Course Name</th>
							<th>Section</th>
							<th>Semester</th>
							<th>Student List</th>
							<th>Edit</th>
							<th>Delete</th>
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
									{course.students.map((student) => (
										<p>
											{student.firstName} {student.lastName}
										</p>
									))}
								</td>
								<td>
									{" "}
									<Button
										value={course.id}
										variant="primary"
										onClick={(e) => handleEdit(e)}
									>
										Edit
									</Button>
								</td>
								<td>
									<Button
										value={course.id}
										variant="primary"
										onClick={(e) => handleDelete(e)}
									>
										Delete
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</div>
	)
}

export default AdminAllCourses
