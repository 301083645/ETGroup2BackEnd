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
			localStorage.setItem("userId", action.payload.user._id)
			localStorage.setItem("email", action.payload.user.email)
			localStorage.setItem("role", action.payload.user.role)
			state.value = {
				token: action.payload.token,
				userId: action.payload.user._id,
				email: action.payload.user.email,
				role: action.payload.user.role,
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
