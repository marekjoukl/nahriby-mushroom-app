import { FiTrash2 } from "react-icons/fi";

const TrashCan = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick} // Pass the onClick prop to the button
      className="bg-red-500 text-white p-2 rounded-full"
    >
      <FiTrash2 className="text-2xl" />
    </button>
  );
};

export default TrashCan;
