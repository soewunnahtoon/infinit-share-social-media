import moment from "moment";
import CommentForm from "./CommentForm";
import Loading from "./Loading";
import Comments from "./Comments";

import { useState } from "react";
import { Link } from "react-router-dom";

import { BiLike, BiSolidLike, BiComment, BiSolidComment } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoReturnDownForward } from "react-icons/io5";
import { getPostComments } from "../utils";

const PostCard = ({ user, post, handleLikePost, handleDeletePost }) => {
  const [showAll, setShowAll] = useState(null);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(null);
  const [showReply, setShowReply] = useState(null);
  const [replyComments, setReplyComments] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleShowComments = async (id) => {
    const toShowComments = showComments === null ? id : null;
    setShowComments(toShowComments);
    setLoading(true);
    await getComments(id);
    setLoading(false);
  };

  const getComments = async (id) => {
    const res = await getPostComments(id);
    setComments(res);
    setLoading(false);
  };

  const handleReply = (id) => {
    const toReply = replyComments === null ? id : null;
    setReplyComments(toReply);
  };

  const handleShowReply = (id) => {
    const toShowReplies = showReply === null ? id : null;
    setShowReply(toShowReplies);
  };

  return (
    <div>
      {post?.length > 0 ? (
        post.map((post) => (
          <div
            key={post._id}
            className="mb-4 bg-primary p-4 shadow-lg rounded-2xl"
          >
            {/* Title */}
            <div className="flex gap-2 items-center mb-2">
              {/* Profile */}
              <Link to={`/profile/${post?.userId?._id}`}>
                <img
                  src={
                    post?.userId?.profileUrl ??
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
                  }
                  alt={`${post?.userId?.firstName} ${post?.userId?.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Link>

              {/* Info */}
              <div className="w-full flex justify-between items-center flex-1">
                {/* Profile Name */}
                <div className="flex flex-col">
                  {/* Name */}
                  <Link to={`/profile/${post?.userId?._id}`}>
                    <p className="font-medium text-ascent-1">
                      {`${post?.userId?.firstName} ${post?.userId?.lastName}`}
                    </p>
                  </Link>

                  {/* Location */}
                  <span className="text-ascent-2 text-xs">
                    {post?.userId?.location}
                  </span>
                </div>

                {/* Post Time */}
                <span className="text-ascent-2 text-sm">
                  {moment(post?.createdAt).fromNow()}
                </span>
              </div>
            </div>

            {/* About Post */}
            <div>
              {/* Post Description */}
              <p className="text-ascent-2">
                {showAll === post?._id
                  ? post?.description
                  : post?.description.slice(0, 300)}

                {/* Show More Function */}
                {post?.description.length < 300 ? (
                  ""
                ) : showAll === post?._id && post?.description.length > 300 ? (
                  <span
                    className="text-blue ml-2 font-medium cursor-pointer"
                    onClick={() => setShowAll(null)}
                  >
                    {" "}
                    Show less
                  </span>
                ) : (
                  <span
                    className="text-blue ml-2 font-medium cursor-pointer"
                    onClick={() => setShowAll(post?._id)}
                  >
                    {" "}
                    Show more
                  </span>
                )}
              </p>

              {/* Post Image */}
              {post?.image && (
                <img
                  src={post?.image}
                  alt="post image"
                  className="w-full mt-2 shadow-lg rounded-2xl"
                />
              )}
            </div>

            {/* Reaction */}
            <div className="mt-4 flex justify-between items-center pt-2 text-ascent-2 border-t border-[#66666645]">
              {/* Like */}
              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => handleLikePost(`/post/like/${post?._id}`)}
              >
                {/* Like Icon */}
                <span>
                  {post?.likes.includes(user?._id) ? (
                    <BiSolidLike
                      size={20}
                      color="blue"
                    />
                  ) : (
                    <BiLike size={20} />
                  )}
                </span>

                {/* Text */}
                <span
                  className={post?.likes.includes(user?._id) ? "text-blue" : ""}
                >
                  {post?.likes?.length > 1
                    ? `${post?.likes?.length} Likes`
                    : `${post?.likes?.length} Like`}
                </span>
              </div>

              {/* Comment */}
              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => handleShowComments(post?._id)}
              >
                {/* Comment Icon */}
                <span>
                  {post?.comments.includes(user?._id) ? (
                    <BiSolidComment
                      size={20}
                      color="blue"
                    />
                  ) : (
                    <BiComment size={20} />
                  )}
                </span>

                {/* Text */}
                <span
                  className={
                    post?.comments.includes(user?._id) ? "text-blue" : ""
                  }
                >
                  {post?.comments?.length > 1
                    ? `${post?.comments?.length} Comments`
                    : `${post?.comments?.length} Comment`}
                </span>
              </div>

              {/* Delete */}
              {user?._id === post?.userId?._id && (
                <div
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={() => handleDeletePost(post?._id)}
                >
                  {/* Delete Icon */}
                  <span>
                    <MdOutlineDeleteOutline
                      size={20}
                      color="red"
                    />
                  </span>

                  {/* Text */}
                  <span className="text-[#FF0000]">Delete</span>
                </div>
              )}
            </div>

            {/* Comment Session */}
            {showComments === post?._id && (
              <div className="w-full mt-2 border-t border-[#66666645]">
                {/* Comment Form */}
                <CommentForm
                  user={user}
                  id={post?._id}
                  getComments={() => getComments(post?._id)}
                />

                {/* Display Comments */}
                {loading ? (
                  <Loading />
                ) : comments?.length > 0 ? (
                  comments.map((comment) => (
                    <div
                      key={comment?._id}
                      className="w-full py-2 border-t border-[#66666645]"
                    >
                      <Comments
                        comment={comment}
                        handleReply={handleReply}
                        replyButton={true}
                        getComments={() => getComments(post?._id)}
                      />

                      {/* Reply Form */}
                      <div className="pl-12">
                        {replyComments === comment?._id && (
                          <CommentForm
                            user={user}
                            id={comment?._id}
                            replyAt={comment?.from}
                            getComments={() => getComments(post?._id)}
                          />
                        )}
                      </div>

                      {/* Show Replies Button */}
                      {comment?.replies?.length > 0 && (
                        <div
                          className="ml-12 pt-2 text-ascent-1 inline-flex items-center gap-4 cursor-pointer self-start"
                          onClick={() => handleShowReply(comment?.replies?._id)}
                        >
                          {/* Icon */}
                          <IoReturnDownForward />

                          {/* Text */}
                          <span>
                            {comment?.replies?.length > 1
                              ? `Show ${comment?.replies?.length} replies`
                              : `Show ${comment?.replies?.length} reply`}
                          </span>
                        </div>
                      )}

                      {/* Show More Replies */}
                      {showReply === comment?.replies?._id &&
                        comment?.replies?.map((reply) => (
                          <div
                            key={reply?._id}
                            className="ml-12 pt-2"
                          >
                            <Comments
                              comment={reply}
                              commentId={comment?._id}
                              replyButton={false}
                              getComments={() => getComments(post?._id)}
                            />
                          </div>
                        ))}
                    </div>
                  ))
                ) : (
                  <span className="flex text-sm text-ascent-2 text-center">
                    No comments, be the first comment
                  </span>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <p className="text-lg text-ascent-2">No Post Available</p>
        </div>
      )}
    </div>
  );
};

export default PostCard;
