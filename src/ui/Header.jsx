import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Bookmark from "./Bookmark";

function Header({
  title,
  backButtonFlag = true,
  RightIcon2 = null,
  onRightIcon2Click,
  userId,
  itemId,
  type,
  navigateTo = -1,
}) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(navigateTo);
  };

  return (
    <div className="fixed top-0 z-10 mb-5 flex h-16 w-full items-center justify-between border-b-4 border-green-900 bg-green-950 p-4 text-white">
      {/* Optional back button (navigation to previous page) */}
      <div className="ml-4 flex items-center">
        {backButtonFlag && (
          <button onClick={goBack} className="mr-4">
            <FaArrowLeft className="text-xl text-white"></FaArrowLeft>
          </button>
        )}
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>

      {/* Right icons also optional, given as param.. such as search icon, save icon, edit icon, etc.. */}
      <div className="mr-8 flex items-center space-x-4">
        {userId && itemId && type && (
          <Bookmark userId={userId} itemId={itemId} type={type} />
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
