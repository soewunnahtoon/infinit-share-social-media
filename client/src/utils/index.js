import axios from "axios";

import { SetPosts } from "../features/post/postSlice.js";

// const API_URL = "http://localhost:8800";
const API_URL = "https://seriouz-infinit-share.onrender.com";

const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

const apiRequest = async ({ url, method, data, token }) => {
  try {
    const result = await API(url, {
      method: method || "GET",
      data: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return result?.data;
  } catch (error) {
    const err = error.response.data;
    return { status: err.status, message: err.message };
  }
};

const fetchPosts = async (token, dispatch, uri, data) => {
  try {
    const res = await apiRequest({
      url: uri || "/post",
      method: "POST",
      data: data || {},
      token: token,
    });

    dispatch(SetPosts(res?.data));
    return;
  } catch (error) {
    console.log(error);
  }
};

const likePost = async ({ uri, token }) => {
  try {
    const res = await apiRequest({
      url: uri,
      method: "POST",
      token: token,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

const deletePost = async (token, id) => {
  try {
    const res = await apiRequest({
      url: `/post/${id}`,
      method: "DELETE",
      token: token,
    });

    return;
  } catch (error) {
    console.log(error);
  }
};

const getUserInfo = async (token, id) => {
  try {
    const uri = id === undefined ? "/user/get-user" : `/user/get-user/${id}`;
    const res = await apiRequest({
      url: uri,
      method: "POST",
      token,
    });

    if (res?.message === "Authentication failed") {
      localStorage.removeItem("user");
      window.alert("User session expired. Login again.");
      window.location.replace("/login");
    }

    return res?.user;
  } catch (error) {
    console.log(error);
  }
};

const sendFriendRequest = async (token, id) => {
  try {
    const res = await apiRequest({
      url: "/user/friend-request",
      method: "POST",
      token,
      data: { requestTo: id },
    });

    return;
  } catch (error) {
    console.log(error);
  }
};

const viewUserProfile = async (token, id) => {
  try {
    const res = await apiRequest({
      url: "/user/profile-view",
      method: "POST",
      token,
      data: { id },
    });

    return;
  } catch (error) {
    console.log(error);
  }
};

const getPostComments = async (id) => {
  try {
    const res = await apiRequest({
      url: `/post/comments/${id}`,
      method: "GET",
    });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export {
  API,
  apiRequest,
  fetchPosts,
  likePost,
  deletePost,
  getUserInfo,
  sendFriendRequest,
  viewUserProfile,
  getPostComments,
};
