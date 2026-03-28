import { useState, useEffect, useRef } from "react";
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
            time: new Date(course.createdAt).toLocaleDateString(),
            rawDate: new Date(course.createdAt)
          });

          course.assignments?.forEach((a, i) => {
            allUpdates.push({
              id: `asg-${course._id}-${i}`,
              type: "TASK",
              text: `New Task in ${course.title}`,
              time: "Assignment",
              rawDate: new Date(course.updatedAt)
            });
          });

          course.resources?.forEach((r, i) => {
            allUpdates.push({
              id: `res-${course._id}-${i}`,
              type: "DOWNLOAD",
              text: `New Resource: ${r.title}`,
              time: "Download",
              rawDate: new Date(course.updatedAt)
            });
          });
        });

        const sortedUpdates = allUpdates.sort((a, b) => b.rawDate - a.rawDate);
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-white/5 transition-all active:scale-95"
      >
        <Bell size={22} className={unreadCount > 0 ? "text-orange-500" : "text-gray-400"} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-orange-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-black animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] md:hidden" onClick={() => setIsOpen(false)} />
          <div className="fixed md:absolute z-[999] bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:top-full md:right-0 md:mt-4 md:w-80 bg-[#0d0d0d] border-t md:border border-gray-800 rounded-t-[2rem] md:rounded-[1.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom md:fade-in md:zoom-in-95 duration-300">
            <div className="p-5 border-b border-gray-800 bg-gray-900/40 flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 flex items-center gap-2">
                <Zap size={12} className="fill-orange-500" /> System Updates
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-1 text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[60vh] md:max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} className="p-5 border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors">
                    <div className="flex gap-4 items-start">
                      <div className="w-9 h-9 shrink-0 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center">
                        {n.type === "COURSE" ? <BookOpen size={16} className="text-orange-500" /> : 
                         n.type === "TASK" ? <ClipboardList size={16} className="text-blue-400" /> : 
                         <Download size={16} className="text-emerald-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-gray-200 leading-snug break-words whitespace-normal">{n.text}</p>
                        <p className="text-[9px] text-gray-600 mt-2 font-black uppercase tracking-widest">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-gray-700 font-bold uppercase text-[10px] tracking-widest">Terminal Clear</div>
              )}
            </div>
            <button onClick={() => setIsOpen(false)} className="w-full py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white bg-gray-900/20 border-t border-gray-800 transition-all">
              Mark all as read
            </button>
          </div>
        </>
      )}
    </div>
  );
}