import { useUser, useClerk } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Added for navigation
import axios from "axios";

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [loading, setLoading] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]); // 🔥 New state for history
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    portfolio: "",
    twitter: "",
    instagram: "",
    github: "",
    leetcode: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, name: user.fullName || "" }));

      // Fetch Profile + Progress
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/user/${user.id}`)
        .then((res) => {
          if (res.data) {
            setFormData({
              name: res.data.name || user.fullName || "",
              mobile: res.data.mobile || "",
              portfolio: res.data.portfolio || "",
              twitter: res.data.twitter || "",
              instagram: res.data.instagram || "",
              github: res.data.github || "",
              leetcode: res.data.leetcode || "",
            });

            // 🔥 Store the learning progress
            // Note: Your backend should "populate" course details or we use what's available
            setEnrolledCourses(res.data.progress || []);
          }
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [user]);

  const updateProfile = async () => {
    try {
      setLoading(true);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/update/${user.id}`,
        formData
      );
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-black text-white min-h-screen pb-32 selection:bg-orange-500/30">
      <div className="max-w-6xl mx-auto px-6 pt-16">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col items-center mb-16">
          <div className="w-32 h-32 bg-orange-500 rounded-full flex items-center justify-center text-black text-6xl font-black mb-6 shadow-2xl shadow-orange-500/20 border-4 border-white/10">
            <span>
              {(formData.name?.trim() || user?.fullName?.trim() || "?").charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter">
            {formData.name || user?.fullName}
          </h1>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-2">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* --- LEFT: FORM SECTION (2 cols wide) --- */}
          <div className="lg:col-span-2 space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
              <section className="bg-gray-900/30 border border-gray-800 p-8 rounded-[2.5rem] space-y-6">
                <h2 className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px]">
                  General Information
                </h2>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-600 ml-1">Display Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} className="profile-input" placeholder="Your Name" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-600 ml-1">Contact Number</label>
                    <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+91..." className="profile-input" />
                  </div>
                </div>
              </section>

              <section className="bg-gray-900/30 border border-gray-800 p-8 rounded-[2.5rem] space-y-6">
                <h2 className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px]">
                  Social Profiles
                </h2>
                <div className="space-y-3">
                  {["github", "leetcode", "twitter", "instagram", "portfolio"].map((field) => (
                    <input key={field} name={field} value={formData[field]} onChange={handleChange} placeholder={`${field.toUpperCase()} URL`} className="profile-input text-xs" />
                  ))}
                </div>
              </section>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
              <button onClick={updateProfile} disabled={loading} className="flex-1 bg-orange-500 text-black font-black py-5 rounded-2xl hover:bg-orange-400 transition-all shadow-xl shadow-orange-500/10 active:scale-95">
                {loading ? "Updating..." : "Save Changes"}
              </button>
              <button onClick={() => signOut()} className="px-8 py-5 border border-red-500/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all font-bold text-sm">
                Logout
              </button>
            </div>
          </div>

          {/* --- RIGHT: ENROLLED HISTORY --- */}
          <div className="lg:col-span-1">
            <section className="bg-gray-900/20 border border-gray-800 p-8 rounded-[2.5rem] h-full">
              <h2 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                Learning History
              </h2>

              <div className="space-y-6">
                {enrolledCourses.length > 0 ? enrolledCourses.map((course, idx) => (
                  <div key={idx} className="group bg-black/40 border border-gray-800 p-5 rounded-3xl hover:border-orange-500/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">In Progress</p>
                        <h3 className="font-bold text-sm text-gray-200 line-clamp-1">Course ID: {course.courseId}</h3>
                      </div>
                      <span className="text-xs font-black text-white">{course.percentage}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mb-5">
                      <div 
                        className="h-full bg-orange-500 transition-all duration-1000" 
                        style={{ width: `${course.percentage}%` }}
                      ></div>
                    </div>

                    <Link 
                      to={`/course/${course.courseId}`}
                      className="block text-center py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase hover:bg-orange-500 hover:text-black transition-all"
                    >
                      Resume Lesson
                    </Link>
                  </div>
                )) : (
                  <div className="text-center py-10">
                    <p className="text-gray-600 text-xs italic">No courses started yet.</p>
                    <Link to="/courses" className="text-orange-500 text-xs font-bold mt-2 block hover:underline">Browse Catalog →</Link>
                  </div>
                )}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}