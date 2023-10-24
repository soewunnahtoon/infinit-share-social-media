import TextInput from "./TextInput";
import CustomButton from "./CustomButton";

import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { PiInfinityFill } from "react-icons/pi";
import { TbSearch } from "react-icons/tb";
import { BsSunFill, BsMoon } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";

import { SetTheme } from "../features/theme/themeSlice";
import { Logout } from "../features/user/userSlice";
import { fetchPosts } from "../utils";

const Navbar = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    await fetchPosts(user?.token, dispatch, "", data);
  };

  const handleChangeTheme = () => {
    const themeColor = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeColor));
  };

  const handleLogOut = () => {
    dispatch(Logout());
  };

  return (
    <div className="navbar w-full flex justify-between items-center py-2 px-4 bg-primary">
      {/* Logo */}
      <Link
        to="/"
        className="flex gap-2 items-center flex-1"
      >
        {/* App Logo */}
        <div className="p-0.5 bg-[#065ad8] rounded text-white text-xl">
          <PiInfinityFill />
        </div>

        {/* App Name */}
        <p className="text-lg md:text-xl text-ascent-1 font-bold">
          INFINIT
          <span className="text-lg md:text-xl text-ascent-2 font-bold">
            SHARE
          </span>
        </p>
      </Link>

      {/* Search Bar */}
      <form
        className="hidden md:flex justify-center items-center flex-1 mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Search Input */}
        <TextInput
          type="text"
          name="search"
          placeholder="Search"
          inputStyles="rounded-l-full"
          register={register("search")}
        />
        {/* Search Button */}
        <CustomButton
          type="submit"
          buttonStyles="bg-[#0444a4] text-white px-6 py-2 text-lg rounded-r-full"
          title={<TbSearch size={21} />}
        />
      </form>

      {/* Icons */}
      <div className="flex gap-4 justify-end items-center text-ascent-1 flex-1">
        {/* Search Icon */}
        <div className="flex md:hidden">
          <CustomButton title={<TbSearch size={22} />} />
        </div>

        {/* Theme Icon */}
        <CustomButton
          title={
            theme === "light" ? <BsSunFill size={18} /> : <BsMoon size={18} />
          }
          onClick={handleChangeTheme}
        />

        {/* Logout Icon */}
        <CustomButton
          title={<BiLogOut size={22} />}
          onClick={handleLogOut}
        />
      </div>
    </div>
  );
};

export default Navbar;
