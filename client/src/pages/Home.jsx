import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import FriendsCard from "../components/FriendsCard";
import FriendRequestsCard from "../components/FriendRequestsCard";
import SuggestedFriendsCard from "../components/SuggestedFriendsCard";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import Loading from "../components/Loading";
import EditProfile from "../components/EditProfile";

import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import {
  apiRequest,
  deletePost,
  fetchPosts,
  getUserInfo,
  likePost,
  sendFriendRequest,
} from "../utils";
import { UserLogin } from "../features/user/userSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { user, edit } = useSelector((state) => state.user);
  const { post } = useSelector((state) => state.post);

  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUser();
    fetchAllPosts();
    fetchFriendRequests();
    fetchSuggestedFriends();
  }, []);

  const getUser = async () => {
    try {
      const res = await getUserInfo(user?.token);
      const newData = { token: user?.token, ...res };

      dispatch(UserLogin(newData));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllPosts = async () => {
    await fetchPosts(user?.token, dispatch);
    setLoading(false);
  };

  const handleLikePost = async (uri) => {
    await likePost({
      uri,
      token: user?.token,
    });
    await fetchAllPosts();
  };

  const handleDeletePost = async (id) => {
    await deletePost(user?.token, id);
    await fetchAllPosts();
  };

  const fetchFriendRequests = async () => {
    try {
      const res = await apiRequest({
        url: "/user/get-friend-request",
        method: "POST",
        token: user?.token,
      });
      setFriendRequests(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFriendRequest = async (id) => {
    try {
      await sendFriendRequest(user?.token, id);
      await fetchSuggestedFriends();
    } catch (error) {
      console.log(error);
    }
  };

  const acceptFriendRequest = async (id, status) => {
    try {
      const res = await apiRequest({
        url: "/user/accept-request",
        method: "POST",
        token: user?.token,
        data: { requestId: id, status },
      });

      setFriendRequests(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSuggestedFriends = async () => {
    try {
      const res = await apiRequest({
        url: "/user/suggested-friends",
        method: "POST",
        token: user?.token,
      });

      setSuggestedFriends(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full bg-bgColor h-screen overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Main Display */}
        <div className="w-full flex gap-4 pt-4 px-4 h-full">
          {/* Left */}
          <div className="hidden md:flex flex-col gap-4 overflow-y-auto w-1/3 lg:w-1/4 h-full pb-20">
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
          </div>

          {/* Center */}
          <div className="flex-1 h-full flex flex-col gap-4 overflow-y-auto rounded-2xl pb-10">
            <PostForm
              user={user}
              fetchAllPosts={fetchAllPosts}
            />

            {loading ? (
              <Loading />
            ) : (
              <PostCard
                user={user}
                post={post}
                handleLikePost={handleLikePost}
                handleDeletePost={handleDeletePost}
              />
            )}
          </div>

          {/* Right */}
          <div className="hidden lg:w-1/4 h-full lg:flex flex-col gap-4 overflow-y-auto pb-20">
            <FriendRequestsCard
              friendRequests={friendRequests}
              acceptFriendRequest={acceptFriendRequest}
            />
            <SuggestedFriendsCard
              suggestedFriends={suggestedFriends}
              handleFriendRequest={handleFriendRequest}
            />
          </div>
        </div>
      </div>

      {edit && <EditProfile />}
    </>
  );
};

export default Home;
