function CircleButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#0FE596] bg-white text-2xl text-[#0FE596] hover:bg-[#0FE596] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0FE596] focus:ring-opacity-50"
    >
      +
    </button>
  );
}

export default CircleButton;
