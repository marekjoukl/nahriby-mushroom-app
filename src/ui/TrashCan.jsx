import { FiTrash2 } from "react-icons/fi";

const TrashCan = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-red-500 text-white p-2 rounded-full transition-transform duration-100 hover:opacity-80"
    >
      <FiTrash2 className="text-2xl" />
    </button>
  );
};

export default TrashCan;
