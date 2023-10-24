import Loading from "./Loading";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";

import { BiImages, BiSolidVideo } from "react-icons/bi";
import { BsFiletypeGif } from "react-icons/bs";
import { apiRequest } from "../utils";

const PostForm = ({ user, fetchAllPosts }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [posting, setPosting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const onSubmit = async (data) => {
    setPosting(true);
    setErrorMessage("");

    try {
      const newData = formData ? { ...data, image: formData.image } : data;

      const res = await apiRequest({
        url: "/post/create-post",
        method: "POST",
        data: newData,
        token: user?.token,
      });

      if (res?.status === false) {
        setErrorMessage(res);
      } else {
        reset({ description: "" });
        setFile(null);
        setFormData({});
        setErrorMessage("");
        await fetchAllPosts();
      }

      setPosting(false);
    } catch (error) {
      console.log(error);
      setPosting(false);
    }
  };

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, image: downloadURL })
        );
      }
    );
  };

  return (
    <div>
      <form
        className="bg-primary p-4 rounded-2xl flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Text Box */}
        <div className="w-full flex items-center gap-2">
          {/* Profile */}
          <img
            src={
              user?.profileUrl ??
              "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
            }
            alt={`${user?.firstName} ${user?.lastName}`}
            className="w-10 h-10 object-cover rounded-full"
          />

          {/* Textbox */}
          <div className="flex-1">
            <TextInput
              name="description"
              placeholder={`What's on your mind, ${`${user?.firstName} ${user?.lastName}`}?`}
              inputStyles="w-full rounded-full"
              register={register("description", {
                required: "Write something about post.",
              })}
              error={errors.description ? errors.description.message : ""}
            />
          </div>
        </div>

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

        {/* Upload Media */}
        <div className="flex justify-evenly items-center">
          {/* For Image */}
          <label
            htmlFor="imageUpload"
            className="flex items-center gap-2 text-ascent-2 hover:text-ascent-1 cursor-pointer"
          >
            <input
              type="file"
              id="imageUpload"
              className="hidden"
              data-max-size="5120"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <BiImages />
            <span>Image</span>
          </label>

          {/* For Video */}
          <label
            htmlFor="videoUpload"
            className="flex items-center gap-2 text-ascent-2 hover:text-ascent-1 cursor-pointer"
          >
            <input
              type="file"
              id="videoUpload"
              className="hidden"
              data-max-size="51200"
              accept=".mp4, .wav"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <BiSolidVideo />
            <span>Video</span>
          </label>

          {/* For Gif */}
          <label
            htmlFor="gifUpload"
            className="flex items-center gap-2 text-ascent-2 hover:text-ascent-1 cursor-pointer"
          >
            <input
              type="file"
              id="gifUpload"
              className="hidden"
              data-max-size="5120"
              accept=".gif"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <BsFiletypeGif />
            <span>Gif</span>
          </label>
        </div>

        {/* Post Button */}
        <div className="w-full">
          {posting ? (
            <Loading />
          ) : (
            <CustomButton
              type="submit"
              buttonStyles="w-full bg-[#0444a4] text-lg text-white flex justify-center py-2 rounded-full font-semibold"
              title="Post"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default PostForm;
