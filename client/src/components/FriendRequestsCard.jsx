import { Link } from "react-router-dom";

import CustomButton from "./CustomButton";

const FriendRequestsCard = ({ friendRequests, acceptFriendRequest }) => {
  return (
    <div className="w-full bg-primary shadow-lg rounded-2xl p-4">
      {/* Title */}
      <div className="flex justify-between items-center text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
        <span>Friend Requests</span>
        <span>{friendRequests?.length}</span>
      </div>

      {/* Friend Request Lists */}
      <div className="w-full flex flex-col gap-2 pt-2">
        {friendRequests?.map(({ _id, requestFrom: request }) => (
          <div
            key={_id}
            className="w-full flex justify-between items-center"
          >
            {/* Request User */}
            <Link
              to={`/profile/${request?._id}`}
              className="flex justify-center items-center flex-1 gap-4"
            >
              {/* Profile */}
              <img
                src={
                  request?.profileUrl ??
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
                }
                alt={`${request?.firstName} ${request?.lastName}`}
                className="w-10 h-10 object-cover rounded-full"
              />

              {/* Info */}
              <div className="flex-1">
                {/* Name */}
                <p className="font-medium text-ascent-1">
                  {`${request?.firstName} ${request?.lastName}`}
                </p>

                {/* Profession */}
                <span className="text-sm text-ascent-2">
                  {request?.profession ?? "No Profession"}
                </span>
              </div>
            </Link>

            {/* Buttons */}
            <div className="flex flex-col 2xl:flex-row gap-1">
              {/* Accept Button */}
              <CustomButton
                title="Accept"
                buttonStyles="flex justify-center items-center bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full"
                onClick={() => acceptFriendRequest(_id, "Accepted")}
              />

              {/* Deny Button */}
              <CustomButton
                title="Deny"
                buttonStyles="flex justify-center items-center border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full"
                onClick={() => acceptFriendRequest(_id, "Denied")}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequestsCard;
