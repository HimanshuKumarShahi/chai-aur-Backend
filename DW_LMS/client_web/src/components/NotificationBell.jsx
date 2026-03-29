import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Bell, BookOpen, ClipboardList, Download, X, Zap } from "lucide-react";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/course`);
        const allUpdates = [];

        res.data.forEach((course) => {
          allUpdates.push({
            id: `course-${course._id}`,
            type: "COURSE",
            text: `New Course: ${course.title}`,
            path: "/courses",
            rawDate: new Date(course.createdAt)
          });

          if (course.assignments?.length > 0) {
            allUpdates.push({
              id: `asg-${course._id}`,
              type: "TASK",
              text: `Assignments updated in ${course.title}`,
              path: "/assignments",
              rawDate: new Date(course.updatedAt)
            });
          }
        });

        const sortedUpdates = allUpdates.sort((a, b) => b.rawDate - a.rawDate).slice(0, 10);
        setNotifications(sortedUpdates);

        const lastSeenCount = parseInt(localStorage.getItem("lastSeenCount") || "0");
        const newItemsCount = sortedUpdates.length - lastSeenCount;
        setUnreadCount(newItemsCount > 0 ? newItemsCount : 0);
      } catch (err) {
        console.error("Notification Error:", err);
      }
    };

    fetchUpdates();
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      setUnreadCount(0);
      localStorage.setItem("lastSeenCount", notifications.length.toString());
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* 🔔 BELL ICON */}
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-white/10 transition-all active:scale-90 z-[60]"
      >
        <Bell size={22} className={unreadCount > 0 ? "text-orange-500" : "text-gray-400"} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-orange-600 text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full border border-black shadow-[0_0_10px_rgba(234,88,12,0.5)]">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📂 NOTIFICATION PANEL */}
      {isOpen && (
        <>
          {/* Backdrop: Only dims the area BELOW the navbar */}
          <div 
            className="fixed inset-0 top-[64px] bg-black/60 backdrop-blur-sm z-[55]" 
            onClick={() => setIsOpen(false)} 
          />
          
          <div 
            className={`
              fixed z-[100]
              /* MOBILE: Positioned right under the Navbar */
              top-[70px] left-4 right-4 mx-auto w-auto max-w-[400px]
              /* DESKTOP: Traditional Dropdown */
              md:absolute md:top-full md:right-0 md:left-auto md:w-80 md:mt-4
              
              bg-[#080808] border border-white/10 rounded-[2rem] md:rounded-[1.5rem] 
              shadow-[0_20px_50px_rgba(0,0,0,1)] overflow-hidden
              animate-in fade-in slide-in-from-top-2 duration-200
            `}
          >
            {/* Header */}
            <div className="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-orange-500 fill-orange-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">System Feed</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Notification List */}
            <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <Link 
                    to={n.path} 
                    key={n.id} 
                    onClick={() => setIsOpen(false)}
                    className="p-5 border-b border-white/5 hover:bg-white/[0.03] transition-colors block group"
                  >
                    <div className="flex gap-4 items-center text-left">
                      <div className="w-10 h-10 shrink-0 rounded-2xl bg-gray-900 border border-white/5 flex items-center justify-center group-hover:border-orange-500/50 transition-colors">
                        {n.type === "COURSE" ? <BookOpen size={18} className="text-orange-500" /> : 
                         <ClipboardList size={18} className="text-blue-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-gray-200 leading-tight mb-1 group-hover:text-white transition-colors">{n.text}</p>
                        <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Active Transmission</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-20 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 italic">Static Environment</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-white/[0.01]">
                <button 
                onClick={() => setIsOpen(false)} 
                className="w-full py-4 bg-white/5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-orange-500 transition-all"
                >
                Return to Command
                </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}