const CustomButton = ({ type, buttonStyles, onClick, title }) => {
  return (
    <button
      type={type || "button"}
      className={buttonStyles}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
