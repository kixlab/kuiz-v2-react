import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
	name: "setKeyword",
	initialState: {
		userInfo: {},
		cid: "",
		cType: false,
		classes: [],
		isLoggedIn: false,
		email: "",
	},
	reducers: {
		setUserEmail: (state, action) => {
			state.email = action.payload;
		},
		loginUser: (state, action) => {
			state.userInfo = action.payload;
			state.isLoggedIn = true;
		},
		logoutUser: (state, action) => {
			state.userInfo = action.payload;
			state.isLoggedIn = false;
		},
		enrollClass: (state, action) => {
			// Fixed - need to check
			if (state.isLoggedIn) {
				state.classes.push({ cid: action.payload.cid, cType: action.payload.cType });
				state.cid = action.payload.cid;
				state.cType = action.payload.cType;
			}
		},
		setCurrentClass: (state, action) => {
			// Added - need to check
			state.cid = action.payload.cid;
			state.cType = action.payload.cType;
		},
	},
});

export const { loginUser, logoutUser, enrollClass, setUserEmail } = userSlice.actions;

export default userSlice.reducer;
