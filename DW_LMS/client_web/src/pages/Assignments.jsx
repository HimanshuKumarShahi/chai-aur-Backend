import { useEffect, useState } from "react";
import axios from "axios";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        // 1. Fetch all courses
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/course`);
        
        // 2. Extract assignments from all courses and flatten them into one list
        const allAssignments = res.data.reduce((acc, course) => {
          if (course.assignments && course.assignments.length > 0) {
            // Attach course title to each assignment for better UI
            const formatted = course.assignments.map(a => ({
              ...a,
              courseName: course.title
            }));
            return [...acc, ...formatted];
          }
          return acc;
        }, []);

        setAssignments(allAssignments);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen pb-20 selection:bg-orange-500/30">
      <header className="pt-20 pb-12 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">
          Course <span className="text-orange-500">Assignments.</span>
        </h1>
        <p className="text-gray-500 text-lg italic">"Practical work is the bridge between knowledge and mastery."</p>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-900/50 rounded-3xl border border-gray-800" />)}
          </div>
        ) : assignments.length > 0 ? (
          <div className="grid gap-6">
            {assignments.map((a, idx) => (
              <div key={idx} className="group bg-gray-900/30 border border-gray-800 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center transition-all hover:border-orange-500/40 hover:bg-gray-900/60">
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                  <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 text-2xl">📝</div>
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-orange-500 transition-colors">{a.title}</h3>
                    <p className="text-gray-500 text-xs uppercase font-black tracking-widest mt-1">
                      From: <span className="text-gray-300">{a.courseName}</span>
                    </p>
                  </div>
                </div>
                <a href={a.fileUrl} target="_blank" rel="noreferrer" className="bg-white text-black px-8 py-3 rounded-2xl font-black text-sm hover:bg-orange-500 hover:text-white transition-all active:scale-95 shadow-lg">
                  View Task
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-900/10 rounded-[3rem] border border-dashed border-gray-800">
            <p className="text-gray-500 font-bold">No active assignments found in your enrolled courses.</p>
          </div>
        )}
      </main>
    </div>
  );
}