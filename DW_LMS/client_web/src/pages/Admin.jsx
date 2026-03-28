import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

export default function Admin() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("create");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [course, setCourse] = useState({
    title: "", description: "", videoUrl: "", thumbnail: "",
    instructor: "", category: "Tech", assignments: [], resources: []
  });

  useEffect(() => {
    fetchCourses();
    if (user) fetchUsers();
  }, [user]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/course`);
      setCourses(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/all`, {
        headers: { clerkid: user?.id }
      });
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  // --- STATS LOGIC ---
  const stats = [
    { label: "Total Students", value: users.filter(u => u.role !== 'admin').length, icon: "👥", color: "text-blue-400" },
    { label: "Total Courses", value: courses.length, icon: "📚", color: "text-orange-500" },
    { label: "Blocked Users", value: users.filter(u => u.isBlocked).length, icon: "🚫", color: "text-red-500" },
    { label: "Admins", value: users.filter(u => u.role === 'admin').length, icon: "🛡️", color: "text-green-400" },
  ];

  // (addField, handleArrayChange, removeField, resetForm, handleEditCourse, handleDeleteCourse, handleToggleBlock, handleDeleteUser functions remain the same as your previous code)
  const addField = (type) => setCourse({ ...course, [type]: [...course[type], { title: "", fileUrl: "" }] });
  const handleArrayChange = (index, type, field, value) => {
    const updatedArray = [...course[type]];
    updatedArray[index][field] = value;
    setCourse({ ...course, [type]: updatedArray });
  };
  const removeField = (index, type) => setCourse({ ...course, [type]: course[type].filter((_, i) => i !== index) });
  const resetForm = () => {
    setCourse({ title: "", description: "", videoUrl: "", thumbnail: "", instructor: "", category: "Tech", assignments: [], resources: [] });
    setIsEditing(false);
    setEditId(null);
  };
  const handleEditCourse = (c) => {
    setCourse({ ...c });
    setEditId(c._id);
    setIsEditing(true);
    setActiveTab("create");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Delete this course permanently?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/course/${id}`, { headers: { clerkid: user.id } });
      fetchCourses();
    } catch (err) { alert("Delete failed"); }
  };
  const handleToggleBlock = async (clerkId, currentStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/user/block/${clerkId}`, { isBlocked: !currentStatus }, { headers: { clerkid: user.id } });
      fetchUsers();
    } catch (err) { alert("Action failed"); }
  };
  const handleDeleteUser = async (clerkId) => {
    if (!window.confirm("Delete account?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/${clerkId}`, { headers: { clerkid: user.id } });
      fetchUsers();
    } catch (err) { alert("Deletion failed"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Unauthorized");
    setLoading(true);
    try {
      const url = isEditing ? `${import.meta.env.VITE_API_URL}/api/course/${editId}` : `${import.meta.env.VITE_API_URL}/api/course/create`;
      const method = isEditing ? 'put' : 'post';
      await axios[method](url, course, { headers: { clerkid: user.id } });
      alert(isEditing ? "Changes Saved!" : "Course Published!");
      resetForm();
      fetchCourses();
    } catch (err) { alert("Error: " + (err.response?.data?.message || err.message)); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-black text-white min-h-screen p-8 pb-32">
      <div className="max-w-6xl mx-auto">
        
        {/* 👑 ADMIN HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-orange-500 uppercase tracking-tighter italic">LMS Command Center.</h1>
            <p className="text-gray-500 text-sm font-bold">Managing as: <span className="text-white">{user?.fullName} (Super Admin)</span></p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-xl">
             <span className="text-orange-500 text-xs font-black uppercase tracking-widest">Admin Mode Active</span>
          </div>
        </header>

        {/* 📊 QUICK STATS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((s, i) => (
            <div key={i} className="bg-gray-900/40 border border-gray-800 p-6 rounded-3xl hover:border-gray-700 transition-all">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-black">{s.value}</div>
              <div className={`text-[10px] uppercase font-black tracking-widest ${s.color}`}>{s.label}</div>
            </div>
          ))}
        </div>
        
        {/* 🧭 NAVIGATION TABS */}
        <div className="flex gap-4 mb-12 bg-gray-900/50 p-2 rounded-2xl border border-gray-800 w-fit">
          {["create", "courses", "users"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${
                activeTab === tab ? "bg-orange-500 text-black shadow-lg" : "text-gray-500 hover:text-white"
              }`}
            >
              {tab === "create" ? (isEditing ? "Edit Course" : "Add Content") : tab === "courses" ? "Manage Catalog" : "Student Directory"}
            </button>
          ))}
        </div>

        {/* --- TAB 1: CONTENT CREATOR --- */}
        {activeTab === "create" && (
          <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
            <section className="bg-gray-900/30 border border-gray-800 p-8 rounded-[2.5rem] space-y-6 shadow-2xl shadow-orange-500/5">
              <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                <h2 className="text-xl font-bold">{isEditing ? `Modify: ${course.title}` : "New Course Details"}</h2>
                {isEditing && <button type="button" onClick={resetForm} className="text-xs text-orange-500 underline">Discard Edits</button>}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <input type="text" placeholder="Course Title" className="admin-input" value={course.title} onChange={(e) => setCourse({...course, title: e.target.value})} required />
                <input type="text" placeholder="Instructor Name" className="admin-input" value={course.instructor} onChange={(e) => setCourse({...course, instructor: e.target.value})} required />
                <input type="text" placeholder="YouTube Video URL" className="admin-input" value={course.videoUrl} onChange={(e) => setCourse({...course, videoUrl: e.target.value})} required />
                <input type="text" placeholder="Thumbnail Image URL" className="admin-input" value={course.thumbnail} onChange={(e) => setCourse({...course, thumbnail: e.target.value})} required />
                <select className="admin-input" value={course.category} onChange={(e) => setCourse({...course, category: e.target.value})}>
                  <option value="Tech">Tech / Programming</option>
                  <option value="Python">Python</option>
                  <option value="React">React / Frontend</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Backend">NodeJS / Backend</option>
                </select>
              </div>
              <textarea placeholder="Write a compelling course description..." className="admin-input h-32" value={course.description} onChange={(e) => setCourse({...course, description: e.target.value})} required />
            </section>

            <div className="grid md:grid-cols-2 gap-8">
              <section className="bg-gray-900/30 border border-gray-800 p-8 rounded-[2rem] space-y-4">
                <div className="flex justify-between items-center"><h2 className="font-bold text-orange-400 text-xs tracking-widest uppercase">Assignments</h2><button type="button" onClick={() => addField('assignments')} className="bg-orange-500 text-black px-3 py-1 rounded-lg text-xs font-bold">+ Add Item</button></div>
                {course.assignments.map((item, idx) => (
                  <div key={idx} className="space-y-2 p-4 bg-black rounded-xl border border-gray-800 relative group/item">
                    <input type="text" placeholder="Label (e.g. Week 1 Task)" className="admin-input text-xs" value={item.title} onChange={(e) => handleArrayChange(idx, 'assignments', 'title', e.target.value)} />
                    <input type="text" placeholder="Link to PDF/File" className="admin-input text-xs" value={item.fileUrl} onChange={(e) => handleArrayChange(idx, 'assignments', 'fileUrl', e.target.value)} />
                    <button type="button" onClick={() => removeField(idx, 'assignments')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">✕</button>
                  </div>
                ))}
              </section>
              <section className="bg-gray-900/30 border border-gray-800 p-8 rounded-[2rem] space-y-4">
                <div className="flex justify-between items-center"><h2 className="font-bold text-orange-400 text-xs tracking-widest uppercase">Downloads</h2><button type="button" onClick={() => addField('resources')} className="bg-orange-500 text-black px-3 py-1 rounded-lg text-xs font-bold">+ Add Item</button></div>
                {course.resources.map((item, idx) => (
                  <div key={idx} className="space-y-2 p-4 bg-black rounded-xl border border-gray-800 relative group/item">
                    <input type="text" placeholder="Label (e.g. Source Code)" className="admin-input text-xs" value={item.title} onChange={(e) => handleArrayChange(idx, 'resources', 'title', e.target.value)} />
                    <input type="text" placeholder="Download URL" className="admin-input text-xs" value={item.fileUrl} onChange={(e) => handleArrayChange(idx, 'resources', 'fileUrl', e.target.value)} />
                    <button type="button" onClick={() => removeField(idx, 'resources')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">✕</button>
                  </div>
                ))}
              </section>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-orange-500 text-black font-black py-5 rounded-2xl hover:bg-orange-400 transition-all shadow-xl shadow-orange-500/20 active:scale-95">{loading ? "Uploading Data..." : isEditing ? "Save Updated Content" : "Publish Course Now"}</button>
          </form>
        )}

        {/* --- TAB 2: CONTENT HISTORY --- */}
        {activeTab === "courses" && (
          <div className="grid gap-4 animate-in slide-in-from-bottom-5 duration-500">
            {courses.length > 0 ? courses.map((c) => (
              <div key={c._id} className="bg-gray-900/40 border border-gray-800 p-6 rounded-[2rem] flex justify-between items-center group transition-colors hover:border-orange-500/30">
                <div className="flex items-center gap-6">
                  <img src={c.thumbnail} className="w-24 h-14 object-cover rounded-xl border border-gray-800 shadow-lg" alt="" />
                  <div>
                    <h3 className="font-black text-xl group-hover:text-orange-500 transition-colors">{c.title}</h3>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{c.instructor} • {c.assignments?.length || 0} Assignments</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEditCourse(c)} className="p-4 bg-gray-800 rounded-2xl hover:bg-white hover:text-black transition-all">✏️</button>
                  <button onClick={() => handleDeleteCourse(c._id)} className="p-4 bg-gray-800 rounded-2xl hover:bg-red-500 transition-all text-white">🗑️</button>
                </div>
              </div>
            )) : <div className="text-center py-20 bg-gray-900/20 rounded-[3rem] border border-dashed border-gray-800 text-gray-600 italic">No courses exist in the catalog yet.</div>}
          </div>
        )}

        {/* --- TAB 3: STUDENT & ADMIN DIRECTORY --- */}
        {activeTab === "users" && (
          <div className="bg-gray-900/20 border border-gray-800 rounded-[2.5rem] overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-900/50 text-orange-500 text-[10px] uppercase tracking-[0.2em]">
                  <tr>
                    <th className="p-8">Student Identity</th>
                    <th>Privileges</th>
                    <th>Account Status</th>
                    <th className="text-right p-8">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.length > 0 ? users.map((u) => (
                    <tr key={u.clerkId} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-8">
                        <div className="font-black text-lg">{u.name || "Guest Learner"}</div>
                        <div className="text-xs text-gray-500 font-mono italic">{u.email}</div>
                      </td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${u.role === 'admin' ? 'bg-orange-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                          {u.role === 'admin' ? "👑 ADMIN" : "🎓 STUDENT"}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${u.isBlocked ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                          <span className={`text-xs font-black uppercase ${u.isBlocked ? 'text-red-500' : 'text-green-500'}`}>{u.isBlocked ? "Blocked" : "Active"}</span>
                        </div>
                      </td>
                      <td className="p-8 text-right space-x-6">
                        <button onClick={() => handleToggleBlock(u.clerkId, u.isBlocked)} className="text-[10px] font-black uppercase hover:text-orange-500 transition-colors">
                          {u.isBlocked ? "Restore Access" : "Restrict Student"}
                        </button>
                        <button onClick={() => handleDeleteUser(u.clerkId)} className="text-[10px] font-black uppercase text-red-500/40 hover:text-red-500 transition-colors">
                          Wipe Data
                        </button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="4" className="p-10 text-center text-gray-600 italic">No students registered yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}