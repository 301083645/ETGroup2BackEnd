import React, { Component, useEffect, useState } from "react"
import axios from "axios"
import { Button, Card, Col, Row, Table } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { setLocalUserLogin } from "../features/authSlice"

function Home() {
	

	return (
		<div>
			<h2> Courses Management System</h2>
			<p>Please login</p>
			
		</div>
	)
}

export default Home
