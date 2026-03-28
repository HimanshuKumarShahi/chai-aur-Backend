import { useEffect, useState } from "react";
import axios from "axios";

export default function Downloads() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/course`);
        
        // Flatten all resources from all courses
        const allResources = res.data.reduce((acc, course) => {
          if (course.resources && course.resources.length > 0) {
            const formatted = course.resources.map(r => ({
              ...r,
              courseName: course.title
            }));
            return [...acc, ...formatted];
          }
          return acc;
        }, []);

        setResources(allResources);
      } catch (err) {
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen pb-20">
      <header className="pt-20 pb-12 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">
          My <span className="text-orange-500">Resources.</span>
        </h1>
        <p className="text-gray-500 text-lg italic">Get the source code, assets, and project files for your learning.</p>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-900/50 rounded-[2.5rem] border border-gray-800" />)}
          </div>
        ) : resources.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((r, idx) => (
              <div key={idx} className="group bg-gray-900/40 border border-gray-800 p-8 rounded-[2.5rem] transition-all hover:bg-gray-900/80 hover:border-orange-500/30">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-2xl text-orange-500">💾</div>
                  <span className="text-[10px] bg-white/5 text-gray-400 border border-white/10 px-3 py-1 rounded-full font-black uppercase tracking-widest">Asset</span>
                </div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-orange-500 transition-colors">{r.title}</h3>
                <p className="text-gray-500 text-[10px] mb-8 uppercase font-black tracking-widest">{r.courseName}</p>
                <a href={r.fileUrl} download className="w-full block text-center bg-white text-black py-4 rounded-2xl font-black text-sm hover:bg-orange-500 hover:text-white transition-all active:scale-95 shadow-xl">
                  Download File
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-900/10 rounded-[3rem] border border-dashed border-gray-800 text-gray-500 italic">
            Your vault is empty. Complete lessons to unlock resources.
          </div>
        )}
      </main>
    </div>
  );
}