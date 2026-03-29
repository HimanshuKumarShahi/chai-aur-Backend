import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Bell, BookOpen, ClipboardList, X, Zap } from "lucide-react";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // 📡 FETCH UPDATES
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/course`
        );

        let allUpdates = [];

        res.data.forEach((course) => {
          // 📚 New Course
          allUpdates.push({
            id: `course-${course._id}`,
            type: "COURSE",
            text: `New Course: ${course.title}`,
            path: "/courses",
            rawDate: new Date(course.createdAt),
          });

          // ⚡ Assignments (each one separate)
          if (course.assignments?.length > 0) {
            course.assignments.forEach((a, i) => {
              allUpdates.push({
                id: `asg-${course._id}-${i}`,
                type: "TASK",
                text: `New Assignment: ${a.title}`,
                path: "/assignments",
                rawDate: new Date(a.createdAt || course.updatedAt),
              });
            });
          }
        });

        // 🧠 Sort latest first
        const sorted = allUpdates
          .sort((a, b) => b.rawDate - a.rawDate)
          .slice(0, 10);

        setNotifications(sorted);

        // ✅ REAL UNREAD COUNT (time-based)
        const lastSeenTime = localStorage.getItem("lastSeenTime");

        if (!lastSeenTime) {
          setUnreadCount(sorted.length);
        } else {
          const newItems = sorted.filter(
            (item) => new Date(item.rawDate) > new Date(lastSeenTime)
          );
          setUnreadCount(newItems.length);
        }
      } catch (err) {
        console.error("Notification Error:", err);
      }
    };

    fetchUpdates();
  }, []);

  // 🔔 TOGGLE
  const handleToggle = () => {
    if (!isOpen) {
      setUnreadCount(0);

      // ✅ Save current time (important fix)
      localStorage.setItem("lastSeenTime", new Date().toISOString());
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* 🔔 BELL */}
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-white/10 transition active:scale-90"
      >
        <Bell
          size={22}
          className={unreadCount > 0 ? "text-orange-500" : "text-gray-400"}
        />

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-orange-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📂 PANEL */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-3 w-80 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-orange-500" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Notifications
                </span>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* LIST */}
            <div className="max-h-[350px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    to={n.path}
                    onClick={() => setIsOpen(false)}
                    className="flex gap-3 items-center p-4 border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <div className="w-9 h-9 rounded-lg bg-black border border-white/10 flex items-center justify-center">
                      {n.type === "COURSE" ? (
                        <BookOpen size={16} className="text-orange-500" />
                      ) : (
                        <ClipboardList size={16} className="text-blue-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm text-gray-300 font-medium">
                        {n.text}
                      </p>
                      <p className="text-[10px] text-gray-600">
                        {n.rawDate.toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-10 text-center text-gray-500 text-sm">
                  No notifications
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}