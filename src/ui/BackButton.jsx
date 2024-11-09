import { useNavigate } from "react-router-dom";

function BackButton({ iconType, navigateTo }) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(navigateTo);
  };

  // Determine the icon based on the prop
  const icon =
    iconType === "x" ? (
      <span>&#10005;</span> // X icon (Unicode character)
    ) : (
      <span>&#8592;</span> // Left arrow (Unicode character)
    );

  return (
    <button
      onClick={handleBackClick}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
    >
      {icon}
    </button>
  );
}

export default BackButton;
