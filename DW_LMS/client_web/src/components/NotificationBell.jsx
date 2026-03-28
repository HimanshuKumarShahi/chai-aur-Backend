import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0); // 🔥 State for the badge number
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/course`);
        const allUpdates = [];

        res.data.forEach((course) => {
          // 1. Course Notifications
          allUpdates.push({
            id: `course-${course._id}`,
            type: "COURSE",
            text: `New Course: ${course.title}`,
            time: new Date(course.createdAt).toLocaleDateString(),
          });

          // 2. Assignment Notifications
          course.assignments?.forEach((a, i) => {
            allUpdates.push({
              id: `asg-${course._id}-${i}`,
              type: "TASK",
              text: `New Task in ${course.title}`,
              time: "Assignment",
            });
          });

          // 3. Resource/Download Notifications
          course.resources?.forEach((r, i) => {
            allUpdates.push({
              id: `res-${course._id}-${i}`,
              type: "DOWNLOAD",
              text: `New Resource: ${r.title}`,
              time: "Download",
            });
          });
        });

        // Sort by newest
        const sortedUpdates = allUpdates.reverse();
        setNotifications(sortedUpdates);

        // 🔥 BADGE LOGIC: Compare total count with what user last saw
        const lastSeenCount = parseInt(localStorage.getItem("lastSeenCount") || "0");
        const newItemsCount = sortedUpdates.length - lastSeenCount;

        if (newItemsCount > 0) {
          setUnreadCount(newItemsCount);
        } else {
          setUnreadCount(0);
        }
      } catch (err) {
        console.error("Notification Error:", err);
      }
    };

    fetchUpdates();
  }, []);

  // 🔥 HANDLE OPENING (Clear Badge)
  const handleToggle = () => {
    if (!isOpen) {
      setUnreadCount(0);
      // Save the current total count as "seen"
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
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 The Bell Icon */}
      <button
        onClick={handleToggle}
        className="relative p-2 text-xl hover:bg-white/5 rounded-full transition-all"
      >
        <span>🔔</span>
        {/* Only show badge if unreadCount > 0 */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-orange-500 text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-black">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📂 The Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-72 bg-[#0a0a0a] border border-gray-800 rounded-2xl shadow-2xl z-[100] overflow-hidden">
          <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-500">
              Notification Center
            </h3>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-4 border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors cursor-default"
                >
                  <div className="flex gap-3">
                    <span className="text-xs">
                      {n.type === "COURSE" ? "📚" : n.type === "TASK" ? "📝" : "💾"}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-gray-200 leading-tight">
                        {n.text}
                      </p>
                      <p className="text-[9px] text-gray-600 mt-1 uppercase font-black">
                        {n.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-600 italic text-xs">
                Your vault is up to date.
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-3 text-[9px] font-black uppercase text-gray-500 hover:text-white bg-black/40"
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
}