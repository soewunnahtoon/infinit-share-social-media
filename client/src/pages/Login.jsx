import TextInput from "../components/TextInput";
import Loading from "../components/Loading";
import CustomButton from "../components/CustomButton";

import { useState } from "react";
import { PiInfinityFill } from "react-icons/pi";
import { BsShare } from "react-icons/bs";
import { ImConnection } from "react-icons/im";
import { AiOutlineInteraction } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { UserLogin } from "../features/user/userSlice";
import { apiRequest } from "../utils";

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const res = await apiRequest({
        url: "/auth/login",
        method: "POST",
        data: data,
      });

      if (res.status === false) {
        setErrorMessage(res);
      } else {
        setErrorMessage("");

        const saveData = {
          token: res?.token,
          ...res?.user,
        };
        dispatch(UserLogin(saveData));
        navigate("/");
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-bgColor w-full h-[100vh] flex justify-center items-center p-6">
      <div className="w-full md:w-2/3 h-full lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center">
          {/* App Name */}
          <div className="w-full flex gap-2 items-center mb-6">
            <div className="p-0.5 bg-[#065ad8] rounded text-white text-2xl">
              <PiInfinityFill />
            </div>
            <span className="text-2xl text-ascent-1 font-bold">
              INFINIT
              <span className="text-2xl text-ascent-2 font-bold">SHARE</span>
            </span>
          </div>

          {/* Route Info */}
          <div className="flex flex-col gap-1">
            <p className="text-ascent-1 text-base font-semibold">
              Login to your account
            </p>
            <span className="text-sm mt-2 text-ascent-2">Welcome back</span>
          </div>

          {/* Input Forms */}
          <form
            className="py-8 flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              label="Email Address"
              labelStyles="ml-4"
              type="email"
              name="email"
              placeholder="email@example.com"
              inputStyles="w-full rounded-full"
              register={register("email", {
                required: "Email address is required.",
              })}
              error={errors.email ? errors.email?.message : ""}
            />

            <TextInput
              label="Password"
              labelStyles="ml-4"
              type="password"
              name="password"
              placeholder="Password"
              inputStyles="w-full rounded-full"
              register={register("password", {
                required: "Password is required.",
              })}
              error={errors.password ? errors.password?.message : ""}
            />

            <Link
              to="/reset-password"
              className="text-sm text-right text-blue font-semibold hover:underline cursor-pointer self-end"
            >
              Forgotten password?
            </Link>

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

            {isSubmitting ? (
              <Loading />
            ) : (
              <CustomButton
                type={"submit"}
                buttonStyles={
                  "inline-flex justify-center rounded-full bg-blue py-2 text-sm font-medium text-white outline-none"
                }
                title={"Login"}
              />
            )}
          </form>

          {/* Create Account */}
          <p className="text-ascent-2 text-sm text-center">
            Don't have an account?
            <Link
              to="/register"
              className="text-[#065ad8] font-semibold ml-2 cursor-pointer"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Right Side */}
        <div className="hidden w-1/2 h-full lg:flex flex-col justify-center items-center bg-blue">
          <div className="relative w-full flex items-center justify-center">
            {/* App Logo */}
            <div className="w-48 2xl:w-64 h-48 2xl:h-64 rounded-full bg-white text-blue flex items-center justify-center text-9xl 2xl:text-[10rem]">
              <PiInfinityFill />
            </div>

            {/* Logo Tags */}
            <div className="absolute right-3 top-12 flex items-center gap-1 bg-white px-5 py-2 rounded-full">
              <BsShare size={14} />
              <span className="text-xs font-medium">Share</span>
            </div>

            <div className="absolute left-5 top-0 flex items-center gap-1 bg-white px-5 py-2 rounded-full">
              <ImConnection />
              <span className="text-xs font-medium">Connect</span>
            </div>

            <div className="absolute left-5 bottom-3 flex items-center gap-1 bg-white px-5 py-2 rounded-full">
              <AiOutlineInteraction />
              <span className="text-xs font-medium">Interact</span>
            </div>
          </div>

          {/* About App */}
          <div className="mt-16 text-center">
            <p className="text-white text-base">
              Connect with friends & have share for fun
            </p>
            <span className="text-sm text-white/80">
              Share memories with friends and the world.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
