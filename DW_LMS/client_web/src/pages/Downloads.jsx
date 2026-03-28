import { useEffect, useState } from "react";
import axios from "axios";
import { Search, X, Download, FileText, Image as ImageIcon, Book, ShieldCheck, ArrowDownToLine } from "lucide-react";

export default function Downloads() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Book", "PDF", "Image"];

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/course`);
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
        setFilteredResources(allResources);
      } catch (err) {
        console.error("Error fetching vault assets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  useEffect(() => {
    const searchTerm = search.toLowerCase().trim();
    const filtered = resources.filter((r) => {
      const matchesSearch = 
        (r.title || "").toLowerCase().includes(searchTerm) || 
        (r.courseName || "").toLowerCase().includes(searchTerm);
      const matchesCategory = activeCategory === "All" || r.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredResources(filtered);
  }, [search, activeCategory, resources]);

  const triggerDownload = async (url, title) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const extension = url.split('.').pop().split(/\#|\?/)[0] || 'file';
      link.setAttribute("download", `${title}.${extension}`); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(url, "_blank");
    }
  };

  const getIcon = (category) => {
    switch (category) {
      case "Book": return <Book size={28} className="text-orange-500" />;
      case "Image": return <ImageIcon size={28} className="text-blue-400" />;
      default: return <FileText size={28} className="text-emerald-400" />;
    }
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen pb-32 selection:bg-orange-500/30">
      
      {/* 🏔️ Header Section */}
      <header className="relative pt-24 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[300px] bg-orange-600/5 blur-[120px] -z-10" />
        
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <ShieldCheck size={12} /> Encrypted Resource Access
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
            THE <span className="text-orange-500 italic">VAULT.</span>
          </h1>
          
          {/* 🔍 Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-10 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search assets or course titles..."
              className="w-full bg-gray-900/40 border border-gray-800 p-5 pl-14 pr-14 rounded-[2rem] focus:border-orange-500/50 outline-none transition-all placeholder:text-gray-700 font-medium text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 bg-gray-800 rounded-full text-gray-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            )}
          </div>

          {/* 🏷️ Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border-2 ${
                  activeCategory === cat 
                  ? "bg-white border-white text-black scale-105" 
                  : "bg-transparent border-gray-800 text-gray-500 hover:border-gray-600"
                }`}
              >
                {cat}s
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 📚 Results Grid */}
      <main className="max-w-7xl mx-auto px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-72 bg-gray-900/40 rounded-[3rem] border border-gray-800" />
            ))}
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((r, idx) => (
              <div key={idx} className="group relative bg-[#0A0A0A] border border-gray-800/60 p-8 rounded-[3rem] transition-all hover:bg-gray-900/40 hover:border-orange-500/30 hover:-translate-y-2">
                
                {/* File Header */}
                <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 bg-black border border-gray-800 rounded-2xl flex items-center justify-center shadow-2xl group-hover:border-orange-500/20 transition-colors">
                    {getIcon(r.category)}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] bg-orange-500/10 text-orange-500 px-3 py-1 rounded-lg font-black uppercase tracking-tighter border border-orange-500/20">
                      {r.category || "Asset"}
                    </span>
                    <ArrowDownToLine size={16} className="text-gray-800 group-hover:text-orange-500/50 transition-colors" />
                  </div>
                </div>
                
                {/* File Info */}
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors line-clamp-1 mb-2 italic">
                    {r.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-700 rounded-full" />
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.1em] truncate">
                      {r.courseName}
                    </p>
                  </div>
                </div>

                {/* Download Button */}
                <button 
                  onClick={() => triggerDownload(r.fileUrl, r.title)}
                  className="w-full group/btn relative flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] hover:bg-orange-500 hover:text-white transition-all overflow-hidden shadow-2xl active:scale-[0.98]"
                >
                  <span className="relative z-10">Sync to System</span>
                  <Download size={14} className="relative z-10 group-hover/btn:translate-y-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                </button>

                {/* Card Background Decoration */}
                <div className="absolute bottom-6 right-10 text-[6rem] font-black text-white/[0.01] pointer-events-none group-hover:text-orange-500/[0.02] transition-colors select-none">
                    {r.category?.charAt(0)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 🚫 Zero Results View */
          <div className="text-center py-40 bg-gray-900/10 rounded-[4rem] border border-dashed border-gray-800 backdrop-blur-sm">
            <div className="w-24 h-24 bg-gray-900/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-800">
                <Search size={40} className="text-gray-700" />
            </div>
            <h3 className="text-3xl font-black mb-3 uppercase tracking-tighter">No Assets Found</h3>
            <p className="text-gray-600 text-sm max-w-sm mx-auto leading-relaxed mb-10">
              We couldn't find any resources matching <span className="text-white">"{search}"</span>. Try a different search term or category.
            </p>
            <button 
                onClick={() => {setSearch(""); setActiveCategory("All")}} 
                className="bg-gray-900 text-gray-400 px-8 py-3 rounded-xl border border-gray-800 hover:text-white hover:border-gray-500 transition-all font-bold text-xs uppercase tracking-widest"
            >
                Reset Database Filter
            </button>
          </div>
        )}
      </main>
    </div>
  );
}