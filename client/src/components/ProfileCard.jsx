import moment from "moment";

import { UpdateProfile } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { LiaEditSolid } from "react-icons/lia";
import { BsPersonFillAdd } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import {
  BsBriefcase,
  BsFacebook,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";

const ProfileCard = ({ user }) => {
  const dispatch = useDispatch();

  const sendFriendRequest = () => {};

  return (
    <div className="w-full bg-primary flex flex-col items-center shadow-lg rounded-2xl p-4">
      {/* User Profile and Name */}
      <div className="w-full flex items-center justify-between border-b pb-2 border-[#66666645]">
        {/* User Profile */}
        <div className="flex gap-4">
          {/* Profile */}
          <Link to={`/profile/${user?._id}`}>
            <img
              src={
                user?.profileUrl ||
                "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
              }
              alt={`${user?.firstName} ${user?.lastName}`}
              className="w-12 h-12 rounded-full object-cover"
            />
          </Link>

          {/* Username */}
          <div className="flex flex-col justify-center flex-1">
            {/* Name */}
            <Link to={`/profile/${user?._id}`}>
              <p className="text-lg font-medium text-ascent-1">
                {user ? `${user?.firstName} ${user?.lastName}` : "Username"}
              </p>
            </Link>

            {/* Profession */}
            <span className="text-ascent-2 text-sm">
              {user
                ? user?.profession || (
                    <button
                      className="text-blue"
                      onClick={() => dispatch(UpdateProfile(true))}
                    >
                      Add Profrssion
                    </button>
                  )
                : "No Profession"}
            </span>
          </div>
        </div>

        {/* Edit or Request Button */}
        <div>
          {user ? (
            <LiaEditSolid
              size={22}
              className="text-blue cursor-pointer"
              onClick={() => dispatch(UpdateProfile(true))}
            />
          ) : (
            <button
              className="bg-[#0444a430] text-sm text-white p-1 rounded-full"
              onClick={() => sendFriendRequest(data.token, user._id)}
            >
              <BsPersonFillAdd
                size={20}
                className="text-[#0f52b6]"
              />
            </button>
          )}
        </div>
      </div>

      {/* Add Location and Profession */}
      <div className="w-full flex flex-col gap-2 py-2 border-b border-[#66666645]">
        {/* Location */}
        <div className="flex gap-2 items-center text-ascent-2">
          {/* Icon */}
          <CiLocationOn className="text-xl text-ascent-1" />
          {/* Info */}
          <span>
            {user
              ? user?.location || (
                  <button
                    className="text-blue"
                    onClick={() => dispatch(UpdateProfile(true))}
                  >
                    Add Location
                  </button>
                )
              : "Add Location"}
          </span>
        </div>
      </div>

      {/* Account Status */}
      <div className="w-full flex flex-col gap-2 py-2 border-b border-[#66666645]">
        {/* Number of Friends */}
        <p className="text-xl text-ascent-1 font-semibold">
          {user?.friends?.length}{" "}
          <span>{user?.friends?.length > 1 ? "Friends" : "Friend"}</span>
        </p>

        {/* Number of Views */}
        <div className="flex justify-between items-center">
          <span className="text-ascent-2">Who viewed your profile</span>
          <span className="text-ascent-1">{user?.views?.length}</span>
        </div>

        {/* Joined at */}
        <div className="flex justify-between items-center">
          <span className="text-ascent-2">Joined at</span>
          <span className="text-ascent-1">
            {user ? moment(user?.createdAt).fromNow() : ""}
          </span>
        </div>
      </div>

      {/* Social Profiles */}
      <div className="w-full flex flex-col gap-4 pt-2">
        {/* Title */}
        <p className="text-ascent-1 text-lg font-semibold">Social Profiles</p>

        {/* Facebook Icon */}
        <div className="flex gap-2 items-center text-ascent-2">
          <BsFacebook className="text-xl text-ascent-1" />
          <span>Facebook</span>
        </div>

        {/* Instagram Icon */}
        <div className="flex gap-2 items-center text-ascent-2">
          <BsInstagram className="text-xl text-ascent-1" />
          <span>Instagram</span>
        </div>

        {/* Twitter Icon */}
        <div className="flex gap-2 items-center text-ascent-2">
          <BsTwitter className="text-xl text-ascent-1" />
          <span>Twitter</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
