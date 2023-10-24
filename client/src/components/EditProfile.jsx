import TextInput from "./TextInput";
import Loading from "./Loading";
import CustomButton from "./CustomButton";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { BiImages } from "react-icons/bi";
import { UpdateProfile, UserLogin } from "../features/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { apiRequest } from "../utils";

const EditProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((stste) => stste.user);

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [picture, setPicture] = useState(null);
  const [profileData, setProfileData] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", defaultValues: { ...user } });

  useEffect(() => {
    if (picture) {
      handlePictureUpload(picture);
    }
  }, [picture]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const { firstName, lastName, profession, location } = data;
      const profilePicture = profileData.image;

      const res = await apiRequest({
        url: "/user/update-user",
        method: "PUT",
        token: user?.token,
        data: {
          firstName,
          lastName,
          profession,
          location,
          profileUrl: profilePicture ? profilePicture : user?.profileUrl,
        },
      });

      if (res?.status === "failed") {
        setErrorMessage(res);
      } else {
        setErrorMessage(res);
        const newUser = { token: res?.token, ...res?.user };
        dispatch(UserLogin(newUser));
        setPicture(null);
        setProfileData({});
        dispatch(UpdateProfile(false));
      }

      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  const handlePictureUpload = (picture) => {
    const storage = getStorage(app);
    const pictureName = new Date().getTime() + picture.name;
    const storageRef = ref(storage, pictureName);
    const uploadTask = uploadBytesResumable(storageRef, picture);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setProfileData({ ...profileData, image: downloadURL })
        );
      }
    );
  };

  const handleClose = () => {
    dispatch(UpdateProfile(false));
  };

  return (
    <div>
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex justify-center items-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-[#000] opacity-70"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
          &#8203;
          <div
            className="inline-block align-bottom bg-primary rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            {/* Close Button */}
            <div className="flex justify-between px-6 pt-5 pb-2">
              <label
                htmlFor="name"
                className="block font-medium text-xl text-ascent-1 text-left"
              >
                Edit Profile
              </label>

              <button
                className="text-ascent-1"
                onClick={handleClose}
              >
                <MdClose size={22} />
              </button>
            </div>

            <form
              className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInput
                label="First Name"
                labelStyles="ml-4"
                placeholder="First Name"
                type="text"
                inputStyles="w-full rounded-full"
                register={register("firstName", {
                  required: "First Name is required.",
                })}
                erors={errors?.firstName ? errors?.firstName?.message : ""}
              />
              <TextInput
                label="Last Name"
                labelStyles="ml-4"
                placeholder="Last Name"
                type="text"
                inputStyles="w-full rounded-full"
                register={register("lastName", {
                  required: "Last Name is required.",
                })}
                erors={errors?.lastName ? errors?.lastName?.message : ""}
              />
              <TextInput
                label="Profession"
                labelStyles="ml-4"
                placeholder="Profession"
                type="text"
                inputStyles="w-full rounded-full"
                register={register("profession", {
                  required: "Profession is required.",
                })}
                erors={errors?.profession ? errors?.profession?.message : ""}
              />
              <TextInput
                label="Location"
                labelStyles="ml-4"
                placeholder="Location"
                type="text"
                inputStyles="w-full rounded-full"
                register={register("location", {
                  required: "Location is required.",
                })}
                erors={errors?.location ? errors?.location?.message : ""}
              />

              <label
                htmlFor="profileUpload"
                className="flex items-center gap-2 text-ascent-2 hover:text-ascent-1 cursor-pointer"
              >
                <input
                  type="file"
                  id="profileUpload"
                  className="hidden"
                  data-max-size="5120"
                  accept=".jpg, .jpeg, .png"
                  onChange={(e) => setPicture(e.target.files[0])}
                />
                <BiImages />
                <span>Image</span>
              </label>

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

              <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]">
                {isSubmitting ? (
                  <Loading />
                ) : (
                  <CustomButton
                    type="submit"
                    buttonStyles="inline-flex justify-center rounded-full bg-blue px-6 py-2 text-sm font-medium text-white outline-none"
                    title="Submit"
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
