import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import FriendsCard from "../components/FriendsCard";
import PostCard from "../components/PostCard";
import Loading from "../components/Loading";

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deletePost, fetchPosts, getUserInfo, likePost } from "../utils";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { post } = useSelector((state) => state.post);

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUser();
    getPosts();
  }, [id]);

  const uri = `/post/get-user-posts/${id}`;

  const getUser = async () => {
    const res = await getUserInfo(user?.token, id);
    setUserInfo(res);
  };

  const getPosts = async () => {
    await fetchPosts(user?.token, dispatch, uri);
    setLoading(false);
  };

  const handleDeletePost = async (id) => {
    await deletePost(user?.token, id);
    await getPosts();
  };

  const handleLikePost = async (uri) => {
    await likePost({
      uri,
      token: user?.token,
    });
    await getPosts();
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
            <ProfileCard user={userInfo} />

            <div className="block lg:hidden">
              <FriendsCard friends={userInfo?.friends} />
            </div>
          </div>

          {/* Center */}
          <div className="flex-1 h-full flex flex-col gap-4 overflow-y-auto rounded-2xl pb-10">
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
            <FriendsCard friends={userInfo?.friends} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
