import { Link } from "react-router-dom";

const FriendsCard = ({ friends }) => {
  return (
    <div className="w-full bg-primary shadow-lg rounded-2xl p-4">
      {/* Title */}
      <div className="flex justify-between items-center text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
        <span>Friends</span>
        <span>{friends?.length}</span>
      </div>

      {/* Friend Lists */}
      <div className="w-full flex flex-col gap-2 pt-2">
        {friends?.map((friend) => (
          <Link
            key={friend?._id}
            to={`/profile/${friend?._id}`}
            className="w-full flex gap-4 items-center"
          >
            {/* Profile */}
            <img
              src={
                friend?.profileUrl ??
                "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
              }
              alt={`${friend?.firstName} ${friend?.lastName}`}
              className="w-10 h-10 object-cover rounded-full"
            />

            {/* Info */}
            <div className="flex-1">
              {/* Name */}
              <p className="font-medium text-ascent-1">
                {`${friend?.firstName} ${friend?.lastName}`}
              </p>

              {/* Profession */}
              <span className="text-sm text-ascent-2">
                {friend?.profession ?? "No Profession"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FriendsCard;
