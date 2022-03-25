import { createSlice } from "@reduxjs/toolkit"

export const authSlice = createSlice({
	name: "auth",
	initialState: {
		value: {
			token: null,
			userId: null,
			email: null,
			role: null,
			isAuthenticated: false
		}
	},
	reducers: {
		setLoginSuccess: (state, action) => {
			localStorage.setItem("token", action.payload.token)
			localStorage.setItem("userId", action.payload.id)
			localStorage.setItem("email", action.payload.email)
			localStorage.setItem("role", action.payload.role)
			state.value = {
				token: action.payload.token,
				userId: action.payload.id,
				email: action.payload.email,
				role: action.payload.role,
				isAuthenticated: true
			}
		},
		setLogoutSuccess: (state, action) => {
			localStorage.clear()
			state.value = {
				token: null,
				userId: null,
				email: null,
				role: null,
				isAuthenticated: false
			}
		},
		setLocalUserLogin: (state, action) => {
			state.value = {
				token: localStorage.getItem("token"),
				userId: localStorage.getItem("userId"),
				email: localStorage.getItem("email"),
				role: localStorage.getItem("role"),
				isAuthenticated: true
			}
		}
	}
})

export const {
	setLoginSuccess,
	setLogoutSuccess,
	setLocalUserLogin
} = authSlice.actions

export default authSlice.reducer
