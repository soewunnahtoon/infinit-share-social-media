import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(window?.localStorage.getItem("user")) ?? {},
  edit: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage?.removeItem("user");
    },
    updateProfile: (state, action) => {
      state.edit = action.payload;
    },
  },
});

export default userSlice.reducer;

export const UserLogin = (user) => {
  return (dispatch) => {
    dispatch(userSlice.actions.login(user));
  };
};

export const Logout = () => {
  return (dispatch) => {
    dispatch(userSlice.actions.logout());
  };
};

export const UpdateProfile = (value) => {
  return (dispatch) => {
    dispatch(userSlice.actions.updateProfile(value));
  };
};
