import CustomButton from "./CustomButton";

import { Link } from "react-router-dom";

import { BsPersonFillAdd } from "react-icons/bs";

const SuggestedFriendsCard = ({ suggestedFriends, handleFriendRequest }) => {
  return (
    <div className="w-full bg-primary shadow-lg rounded-2xl p-4">
      {/* Title */}
      <div className="flex justify-between items-center text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
        <span>Friend Suggestions</span>
      </div>

      {/* Friend Request Lists */}
      <div className="w-full flex flex-col gap-2 pt-2">
        {suggestedFriends?.map((suggest) => (
          <div
            key={suggest?._id}
            className="w-full flex justify-between items-center"
          >
            {/* Suggest User */}
            <Link
              to={`/profile/${suggest?._id}`}
              className="flex justify-center items-center flex-1 gap-4"
            >
              {/* Profile */}
              <img
                src={
                  suggest?.profileUrl ??
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
                }
                alt={`${suggest?.firstName} ${suggest?.lastName}`}
                className="w-10 h-10 object-cover rounded-full"
              />

              {/* Info */}
              <div className="flex-1">
                {/* Name */}
                <p className="font-medium text-ascent-1">
                  {`${suggest?.firstName} ${suggest?.lastName}`}
                </p>

                {/* Profession */}
                <span className="text-sm text-ascent-2">
                  {suggest?.profession ?? "No Profession"}
                </span>
              </div>
            </Link>

            {/* Add Button */}
            <CustomButton
              title={
                <BsPersonFillAdd
                  size={20}
                  className="text-[#0f52b6]"
                />
              }
              buttonStyles="bg-[#0444a430] text-sm text-white p-1 rounded-full"
              onClick={() => handleFriendRequest(suggest?._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedFriendsCard;
