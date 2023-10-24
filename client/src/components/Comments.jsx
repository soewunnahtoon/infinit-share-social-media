import moment from "moment";

import { BiLike, BiSolidLike } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { likePost } from "../utils";

const Comments = ({
  comment,
  commentId,
  handleReply,
  replyButton,
  getComments,
}) => {
  const { user } = useSelector((state) => state.user);

  const handleLike = async (id) => {
    await likePost({
      uri: !commentId
        ? `/post/like-comment/${id}`
        : `/post/like-comment/${commentId}/${id}`,
      token: user?.token,
    });
    await getComments();
  };

  return (
    <div className="flex gap-2 items-start">
      {/* Profile */}
      <Link to={`/profile/${comment?.userId?._id}`}>
        <img
          src={
            comment?.userId?.profileUrl ??
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
          }
          alt={`${comment?.userId?.firstName} ${comment?.userId?.lastName}`}
          className="w-10 h-10 rounded-full object-cover"
        />
      </Link>

      {/* Name, Comment, Like and Reply */}
      <div className="flex flex-col flex-1">
        {/* Name */}
        <Link to={`/profile/${comment?.userId?._id}`}>
          <p className="font-medium text-ascent-1">
            {`${comment?.userId?.firstName} ${comment?.userId?.lastName}`}
          </p>
        </Link>

        {/* Comment */}
        <p className="text-ascent-2">{comment?.comment}</p>

        {/* Like and Reply */}
        <div className="mt-2 flex gap-6">
          {/* Like */}
          <div
            className="flex gap-2 items-center cursor-pointer text-ascent-2"
            onClick={() => handleLike(comment?._id)}
          >
            {/* /${reply?._id} */}

            {/* Icon */}
            <span>
              {comment?.likes?.includes(user?._id) ? (
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
              className={comment?.likes?.includes(user?._id) ? "text-blue" : ""}
            >
              {comment?.likes?.length > 1
                ? `${comment?.likes?.length} Likes`
                : `${comment?.likes?.length} Like`}
            </span>
          </div>

          {/* Reply */}
          {replyButton ? (
            <div
              className="text-blue cursor-pointer"
              onClick={() => handleReply(comment?._id)}
            >
              Reply
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* Date */}
      <span className="text-ascent-2 text-sm">
        {moment(comment?.createdAt).fromNow()}
      </span>
    </div>
  );
};

export default Comments;
