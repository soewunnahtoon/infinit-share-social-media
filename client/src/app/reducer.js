import { combineReducers } from "@reduxjs/toolkit";

import userSlice from "../features/user/userSlice.js";
import postSlice from "../features/post/postSlice.js";
import themeSlice from "../features/theme/themeSlice.js";

const rootReducer = combineReducers({
  user: userSlice,
  post: postSlice,
  theme: themeSlice,
});

export { rootReducer };
