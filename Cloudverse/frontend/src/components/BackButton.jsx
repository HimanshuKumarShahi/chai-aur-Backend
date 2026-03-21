import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(-1)} // -1 tells React Router to go back one page in history!
      className="group flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold text-sm transition-colors mb-6 cursor-pointer w-fit"
    >
      <div className="bg-white border border-gray-200 group-hover:border-red-200 p-2 rounded-lg shadow-sm group-hover:shadow transition-all group-hover:-translate-x-1">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      Back
    </button>
  );
}