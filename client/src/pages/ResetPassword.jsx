import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import TextInput from "../components/TextInput";
import Loading from "../components/Loading";
import CustomButton from "../components/CustomButton";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {};

  return (
    <div className="w-full h-[100vh] bg-bgColor flex items-center justify-center p-6">
      <div className="bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-lg rounded-lg">
        <p className="text-ascent-1 text-lg font-semibold">Email Address</p>
        <span className="text-sm text-ascent-2">
          Enter email address used during registeration.
        </span>

        <form
          className="py-4 flex flex-col gap-5"
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
              title={"Submit"}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
