import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center justify-center w-10 h-10 rounded-full 
      bg-black/70 backdrop-blur-md border border-white/10 
      text-white hover:bg-orange-500 hover:text-black 
      transition-all duration-200 shadow-lg active:scale-90"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}