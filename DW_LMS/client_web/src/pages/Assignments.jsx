import { useEffect, useState } from "react";
import axios from "axios";
import { FileText, ExternalLink, BookOpen, Layout, ClipboardList } from "lucide-react";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchAssignments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/course`
      );

      const allAssignments = res.data.flatMap(course =>
        (course.assignments || []).map(a => ({
          ...a,
          courseName: course.title
        }))
      );

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
    <div className="bg-[#050505] text-white min-h-screen pb-32 selection:bg-orange-500/30">
      
      {/* 🏔️ Header Section */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[250px] bg-orange-600/5 blur-[120px] -z-10" />
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-gray-800 bg-gray-900/50 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            <ClipboardList size={12} className="text-orange-500" />
            Curriculum Tasks
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
            WORK <span className="text-orange-500 italic">TASKS.</span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto font-medium">
            "Practical work is the bridge between knowledge and mastery." 
            Complete these tasks to earn your certification.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6">
        
        {/* Stats Summary Bar */}
        {!loading && assignments.length > 0 && (
          <div className="flex items-center gap-4 mb-10 px-4 py-3 bg-gray-900/20 border border-gray-800/50 rounded-2xl backdrop-blur-sm w-fit">
            <div className="flex items-center gap-2">
                <Layout size={16} className="text-orange-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Total Tasks: <span className="text-white">{assignments.length}</span>
                </span>
            </div>
          </div>
        )}

        {loading ? (
          /* ✨ Skeleton Loader */
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-900/40 rounded-[2.5rem] border border-gray-800 animate-pulse" />
            ))}
          </div>
        ) : assignments.length > 0 ? (
          <div className="grid gap-6">
            {assignments.map((a, idx) => (
              <div 
                key={idx} 
                className="group relative bg-[#0A0A0A] border border-gray-800 p-6 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center transition-all duration-500 hover:border-orange-500/30 hover:bg-gray-900/40"
              >
                {/* Assignment Info */}
                <div className="flex items-center gap-6 mb-6 md:mb-0 w-full md:w-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform duration-500 group-hover:border-orange-500/20">
                    <FileText size={28} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <BookOpen size={12} className="text-orange-500" />
                        <span className="text-[10px] font-black text-orange-500/80 uppercase tracking-[0.2em]">
                            {a.courseName}
                        </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-gray-100 group-hover:text-white transition-colors">
                        {a.title}
                    </h3>
                    <p className="text-gray-500 text-xs font-medium mt-1">
                        Requirement: Read instructions carefully before submission.
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <a 
                  href={a.fileUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-xl active:scale-95"
                >
                  View Task <ExternalLink size={14} />
                </a>

                {/* Subtle background number index */}
                <span className="absolute top-4 right-8 text-8xl font-black text-white/[0.02] pointer-events-none italic group-hover:text-orange-500/[0.03] transition-colors">
                    0{idx + 1}
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* 🚫 Zero Results View */
          <div className="text-center py-32 bg-gray-900/10 rounded-[4rem] border border-dashed border-gray-800 backdrop-blur-sm">
            <div className="w-20 h-20 bg-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800">
                <ClipboardList size={32} className="text-gray-700" />
            </div>
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">No tasks assigned yet</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
              Check back soon! Assignments appear here once you are enrolled in a course with active curriculum.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}