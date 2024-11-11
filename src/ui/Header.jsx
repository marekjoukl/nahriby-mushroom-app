import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function Header({ title, backButtonFlag = true, 
                  RightIcon1 = null, onRightIcon1Click,
                  RightIcon2 = null, onRightIcon2Click }) {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="fixed top-0 w-full border-b-4 border-green-900 bg-green-950 text-white p-4 flex items-center justify-between z-10 h-16 mb-5">
            {/* Optional back button (navigation to previous page) */}
            <div className="flex items-center ml-4">
                {backButtonFlag && (
                    <button onClick={goBack} className="mr-4">
                        <FaArrowLeft className="text-white text-xl"></FaArrowLeft>
                    </button>
                )}                
                <h1 className="text-2xl font-semibold">{title}</h1>
            </div>
            
            {/* Right icons also optional, given as param.. such as search icon, save icon, edit icon, etc.. */}
            <div className="flex items-center space-x-4 mr-8">
                {RightIcon1 && <RightIcon1 onClick={onRightIcon1Click} className="text-white text-xl cursor-pointer"></RightIcon1>}
                {RightIcon2 && <RightIcon2 onClick={onRightIcon2Click} className="text-white text-xl cursor-pointer"></RightIcon2>}
            </div>

        </div>
    );
}

export default Header;