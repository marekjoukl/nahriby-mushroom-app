import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Bookmark from "./Bookmark";
import { FiLoader } from "react-icons/fi";
import { useNavigation } from "react-router-dom";

function Header({
  title,
  backButtonFlag = true,
  RightIcon1 = null,
  RightIcon2 = null,
  onRightIcon1Click,
  onRightIcon2Click,
  userId,
  itemId,
  type,
  navigateTo = -1,
}) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading"; // Check navigation loading state

  const goBack = () => {
    navigate(navigateTo);
  };

  return (
    <div className="fixed left-0 top-0 z-10 mb-5 flex h-16 w-full items-center justify-between border-b-4 border-green-900 bg-green-950 p-4 text-white">
      {/* Left Section with Back Button and Title */}
      <div className="ml-2 flex items-center">
        {backButtonFlag && (
          <button onClick={goBack} className="mr-4">
            <FaArrowLeft className="text-xl text-white"></FaArrowLeft>
          </button>
        )}
        <h1 className="text-2xl font-semibold">{title}</h1>
        {isLoading && (
          <FiLoader className="ml-2 text-xl animate-spin text-gray-300" />
        )}
      </div>

      {/* Right Section with Optional Icons */}
      <div className="mr-2 flex items-center space-x-6">
        {userId && itemId && type && (
          <Bookmark userId={userId} itemId={itemId} type={type} />
        )}
        {RightIcon1 && (
          <RightIcon1
            onClick={onRightIcon1Click}
            className="cursor-pointer text-xl text-white"
          ></RightIcon1>
        )}
        {RightIcon2 && (
          <RightIcon2
            onClick={onRightIcon2Click}
            className="cursor-pointer text-xl text-white"
          ></RightIcon2>
        )}
      </div>
    </div>
  );
}

export default Header;
