import Loading from "./Loading";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineSend } from "react-icons/ai";
import { apiRequest } from "../utils";

const CommentForm = ({ user, id, replyAt, getComments }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const uri = !replyAt
        ? `/post/comment/${id}`
        : `/post/reply-comment/${id}`;
      const newData = {
        comment: data?.comment,
        from: `${user?.firstName} ${user?.lastName}`,
        replyAt,
      };

      const res = await apiRequest({
        url: uri,
        method: "POST",
        token: user?.token,
        data: newData,
      });

      if (res?.status === "failed") {
        setErrorMessage(res);
      } else {
        reset({ comment: "" });
        setErrorMessage(res);
        await getComments();
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form
        className="w-full py-2 flex items-center gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Profile */}
        <img
          src={
            user?.profileUrl ??
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
          }
          alt={`${user?.firstName} ${user?.lastName}`}
          className="w-10 h-10 rounded-full object-cover"
        />

        {/* Text Input */}
        <TextInput
          name="comment"
          placeholder={replyAt ? `Reply @${replyAt}` : "Comment this post"}
          inputStyles="w-full rounded-full flex-1"
          register={register("comment", {
            required: "Comment cannot be empty",
          })}
          error={errors.comment ? errors.comment.message : ""}
        />

        {/* Error Message */}
        {errorMessage?.message && (
          <span
            className={`text-sm mt-0.5 ${
              errorMessage?.status === "failed"
                ? "text-[#f64949fe]"
                : "text-[#2ba150fe]"
            }`}
          >
            {errorMessage.message}
          </span>
        )}

        {/* Button */}
        <div>
          {loading ? (
            <Loading />
          ) : (
            <CustomButton
              type="submit"
              buttonStyles="bg-[#0444a4] text-white p-3 rounded-full font-semibold text-sm"
              title={<AiOutlineSend />}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
