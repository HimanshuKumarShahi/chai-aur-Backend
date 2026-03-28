import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { 
  LayoutDashboard, PlusCircle, Users as UsersIcon, 
  Video, FileText, CloudUpload, Trash2, Edit3, 
  XCircle, CheckCircle, ShieldCheck, Database, Settings
} from "lucide-react";

export default function Admin() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("create");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [selectedFiles, setSelectedFiles] = useState({}); 
  const [fileUploading, setFileUploading] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [course, setCourse] = useState({
    title: "", description: "", videoUrl: "", thumbnail: "",
    instructor: "", category: "Tech", 
    playlist: [], assignments: [], resources: []
  });

  useEffect(() => {
    fetchCourses();
    if (user) fetchUsers();
  }, [user]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/course`);
      setCourses(res.data);
    } catch (err) { console.error("Fetch Courses Error:", err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/all`, {
        headers: { clerkid: user?.id }
      });
      setUsers(res.data);
    } catch (err) { console.error("Fetch Users Error:", err); }
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) setSelectedFiles({ ...selectedFiles, [index]: file });
  };

  const uploadToCloudinary = async (index) => {
    const file = selectedFiles[index];
    if (!file) return alert("Please select a file first");
    const formData = new FormData();
    formData.append("file", file);
    try {
      setFileUploading(index);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data", clerkid: user.id }
      });
      const updatedResources = [...course.resources];
      updatedResources[index].fileUrl = res.data.url;
      setCourse({ ...course, resources: updatedResources });
      const newSelectedFiles = { ...selectedFiles };
      delete newSelectedFiles[index];
      setSelectedFiles(newSelectedFiles);
      alert("Asset Secured in Cloudinary!");
    } catch (err) {
      alert("Upload Failed: " + (err.response?.data?.message || err.message));
    } finally {
      setFileUploading(null);
    }
  };

  const handleRemoveResource = async (index) => {
    const resourceToDelete = course.resources[index];
    if (resourceToDelete.fileUrl && resourceToDelete.fileUrl.includes("cloudinary.com")) {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/upload/delete`, 
          { url: resourceToDelete.fileUrl }, 
          { headers: { clerkid: user.id } }
        );
      } catch (err) { console.error("Cloudinary Cleanup Failed:", err.message); }
    }
    const updatedResources = course.resources.filter((_, i) => i !== index);
    setCourse({ ...course, resources: updatedResources });
  };

  const addField = (type) => {
    const newField = type === 'resources' 
      ? { title: "", fileUrl: "", category: "PDF" } 
      : type === 'playlist' 
      ? { title: "", videoUrl: "" } 
      : { title: "", fileUrl: "" };
    setCourse({ ...course, [type]: [...course[type], newField] });
  };

  const handleArrayChange = (index, type, field, value) => {
    const updatedArray = [...course[type]];
    updatedArray[index][field] = value;
    setCourse({ ...course, [type]: updatedArray });
  };

  const removeField = (index, type) => {
    if (type === 'resources') { handleRemoveResource(index); } 
    else { setCourse({ ...course, [type]: course[type].filter((_, i) => i !== index) }); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEditing ? `${import.meta.env.VITE_API_URL}/api/course/${editId}` : `${import.meta.env.VITE_API_URL}/api/course/create`;
      await axios[isEditing ? 'put' : 'post'](url, course, { headers: { clerkid: user.id } });
      alert("LMS Database Updated!");
      resetForm();
      fetchCourses();
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setCourse({ title: "", description: "", videoUrl: "", thumbnail: "", instructor: "", category: "Tech", playlist: [], assignments: [], resources: [] });
    setIsEditing(false);
    setEditId(null);
    setSelectedFiles({});
  };

  const handleEditCourse = (c) => {
    setCourse({ ...c });
    setEditId(c._id);
    setIsEditing(true);
    setActiveTab("create");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBlock = async (id, status) => {
     await axios.put(`${import.meta.env.VITE_API_URL}/api/user/block/${id}`, { isBlocked: !status }, { headers: { clerkid: user.id } });
     fetchUsers();
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Delete course permanently?")) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/course/${id}`, { headers: { clerkid: user.id } });
      fetchCourses();
    }
  };

  const stats = [
    { label: "Students", value: users.filter(u => u.role !== 'admin').length, icon: <UsersIcon size={20}/>, color: "text-blue-400" },
    { label: "Courses", value: courses.length, icon: <Video size={20}/>, color: "text-orange-500" },
    { label: "Banned", value: users.filter(u => u.isBlocked).length, icon: <XCircle size={20}/>, color: "text-red-500" },
    { label: "Staff", value: users.filter(u => u.role === 'admin').length, icon: <ShieldCheck size={20}/>, color: "text-green-400" },
  ];

  return (
    <div className="bg-[#050505] text-white min-h-screen p-4 md:p-8 pb-32 selection:bg-orange-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-orange-500 uppercase italic tracking-tighter flex items-center gap-3">
               <Database className="text-orange-500" /> LMS Master Control
            </h1>
            <div className="inline-flex px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold border border-white/10 text-gray-500 uppercase tracking-widest">
              Admin Terminal: {user?.fullName}
            </div>
          </div>

          <nav className="flex flex-wrap gap-2 bg-gray-900/50 p-1.5 rounded-2xl border border-gray-800 w-full lg:w-auto">
            {["create", "courses", "users"].map((t) => (
              <button 
                key={t} 
                onClick={() => setActiveTab(t)} 
                className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest ${activeTab === t ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20" : "text-gray-500 hover:text-white"}`}
              >
                {t === "create" ? (isEditing ? "Modify Entry" : "Initialize New") : t === "courses" ? "Database" : "User Directory"}
              </button>
            ))}
          </nav>
        </header>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-gray-900/20 border border-gray-800 p-5 md:p-6 rounded-[2rem] group hover:border-orange-500/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl md:text-4xl font-black italic tracking-tighter">{s.value}</span>
                <span className={`${s.color} opacity-40 group-hover:opacity-100 transition-opacity`}>{s.icon}</span>
              </div>
              <p className={`text-[10px] uppercase font-black tracking-[0.2em] text-gray-500`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* --- CREATE / EDIT TAB --- */}
        {activeTab === "create" && (
          <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">
            {/* 🏷️ BASICS CARD */}
            <div className="bg-gray-900/20 border border-gray-800 p-6 md:p-10 rounded-[3rem] shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold italic flex items-center gap-2">
                  <Settings size={20} className="text-orange-500" />
                  {isEditing ? `System Editing: ${course.title}` : "System Configuration"}
                </h2>
                {isEditing && (
                  <button type="button" onClick={resetForm} className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                    Exit Edit Mode
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-black text-gray-600 ml-4 tracking-widest">Entry Title</label>
                   <input type="text" placeholder="Title" className="admin-input-v2" value={course.title} onChange={(e) => setCourse({...course, title: e.target.value})} required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-black text-gray-600 ml-4 tracking-widest">Primary Instructor</label>
                   <input type="text" placeholder="Instructor" className="admin-input-v2" value={course.instructor} onChange={(e) => setCourse({...course, instructor: e.target.value})} required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-black text-gray-600 ml-4 tracking-widest">YT Preview Hash</label>
                   <input type="text" placeholder="Preview YT Link" className="admin-input-v2" value={course.videoUrl} onChange={(e) => setCourse({...course, videoUrl: e.target.value})} required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase font-black text-gray-600 ml-4 tracking-widest">Thumbnail Source</label>
                   <input type="text" placeholder="Thumbnail URL" className="admin-input-v2" value={course.thumbnail} onChange={(e) => setCourse({...course, thumbnail: e.target.value})} required />
                </div>
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] uppercase font-black text-gray-600 ml-4 tracking-widest">Knowledge Category</label>
                   <select className="admin-input-v2 appearance-none" value={course.category} onChange={(e) => setCourse({...course, category: e.target.value})}>
                    <option value="Tech">General Tech</option>
                    <option value="Python">Python</option>
                    <option value="React">React</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Backend">Backend</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] uppercase font-black text-gray-600 ml-4 tracking-widest">Deep Description</label>
                   <textarea placeholder="Description" className="admin-input-v2 h-32 py-4" value={course.description} onChange={(e) => setCourse({...course, description: e.target.value})} required />
                </div>
              </div>
            </div>

            {/* 🔥 VAULT UPLOAD SECTION */}
            <div className="bg-gray-900/20 border border-gray-800 p-6 md:p-10 rounded-[3rem]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-sm font-black text-orange-500 uppercase tracking-[0.3em] italic">Asset Vault</h2>
                <button type="button" onClick={() => addField('resources')} className="bg-white text-black px-5 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-orange-500 hover:text-white transition-all">
                  + Sync New Asset
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {course.resources.map((r, i) => (
                  <div key={i} className="flex flex-col gap-4 p-6 bg-black/40 border border-gray-800 rounded-[2rem] relative group border-l-4 border-l-orange-500 hover:bg-black transition-colors">
                    <div className="flex gap-2">
                        <select className="admin-input-v2 !py-2 !text-[10px] w-1/3" value={r.category} onChange={(e) => handleArrayChange(i, 'resources', 'category', e.target.value)}>
                            <option value="Book">📚 Book</option>
                            <option value="PDF">📄 PDF Note</option>
                            <option value="Image">🖼️ Image</option>
                        </select>
                        <input placeholder="Asset Name" className="admin-input-v2 !py-2 !text-[11px] w-2/3" value={r.title} onChange={(e) => handleArrayChange(i, 'resources', 'title', e.target.value)} />
                    </div>

                    <div className="space-y-3 pt-2">
                        <input placeholder="Cloud URL" className="admin-input-v2 !py-2 !text-[10px] border-orange-500/10 text-gray-500" value={r.fileUrl} onChange={(e) => handleArrayChange(i, 'resources', 'fileUrl', e.target.value)} />
                        
                        <div className="flex items-center gap-3">
                            <input type="file" className="hidden" id={`vault-${i}`} onChange={(e) => handleFileChange(e, i)} />
                            <label htmlFor={`vault-${i}`} className="flex-1 text-center p-3 bg-gray-900 border border-dashed border-gray-700 rounded-xl text-[10px] cursor-pointer hover:border-white transition-all text-gray-500 font-bold uppercase truncate">
                              {selectedFiles[i] ? selectedFiles[i].name : "Pick Local Module"}
                            </label>
                            {selectedFiles[i] && (
                                <button 
                                  type="button"
                                  disabled={fileUploading === i}
                                  onClick={() => uploadToCloudinary(i)}
                                  className="bg-orange-500 text-black px-5 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-white transition-all active:scale-95 disabled:opacity-50"
                                >
                                  {fileUploading === i ? "Syncing..." : <CloudUpload size={18}/>}
                                </button>
                            )}
                        </div>
                    </div>
                    <button type="button" onClick={() => removeField(i, 'resources')} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-110">✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* CURRICULUM & ASSIGNMENTS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-gray-900/20 border border-gray-800 p-6 md:p-8 rounded-[3rem]">
                  <div className="flex justify-between items-center mb-6 px-2">
                    <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Curriculum Flow</h2>
                    <button type="button" onClick={() => addField('playlist')} className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em]">+ Add Lesson</button>
                  </div>
                  <div className="space-y-4">
                  {course.playlist.map((item, idx) => (
                    <div key={idx} className="relative group bg-black/60 p-5 rounded-[1.5rem] border border-gray-800 hover:border-orange-500/20 transition-all">
                        <input placeholder="Lesson Title" className="bg-transparent w-full text-sm font-bold outline-none border-b border-gray-800 pb-2 mb-3" value={item.title} onChange={(e) => handleArrayChange(idx, 'playlist', 'title', e.target.value)} />
                        <input placeholder="YouTube Link" className="bg-transparent w-full text-[11px] text-orange-500/50 outline-none" value={item.videoUrl} onChange={(e) => handleArrayChange(idx, 'playlist', 'videoUrl', e.target.value)} />
                        <button type="button" onClick={() => removeField(idx, 'playlist')} className="absolute top-4 right-4 text-gray-700 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  ))}
                  </div>
               </div>

               <div className="bg-gray-900/20 border border-gray-800 p-6 md:p-8 rounded-[3rem]">
                  <div className="flex justify-between items-center mb-6 px-2">
                    <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Mission Objectives</h2>
                    <button type="button" onClick={() => addField('assignments')} className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em]">+ New Task</button>
                  </div>
                  <div className="space-y-4">
                  {course.assignments.map((a, i) => (
                    <div key={i} className="relative group bg-black/60 p-5 rounded-[1.5rem] border border-gray-800 hover:border-orange-500/20 transition-all">
                        <input placeholder="Task Title" className="bg-transparent w-full text-sm font-bold outline-none border-b border-gray-800 pb-2 mb-3" value={a.title} onChange={(e) => handleArrayChange(i, 'assignments', 'title', e.target.value)} />
                        <input placeholder="Task Instruction Link" className="bg-transparent w-full text-[11px] text-orange-500/50 outline-none" value={a.fileUrl} onChange={(e) => handleArrayChange(i, 'assignments', 'fileUrl', e.target.value)} />
                        <button type="button" onClick={() => removeField(i, 'assignments')} className="absolute top-4 right-4 text-gray-700 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  ))}
                  </div>
               </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-orange-500 text-black py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.3em] shadow-2xl hover:bg-white active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              {loading ? "Decrypting Buffer..." : isEditing ? "Push Changes" : "Deploy to Mainframe"}
              <CheckCircle size={20}/>
            </button>
          </form>
        )}

        {/* --- CONTENT TAB --- */}
        {activeTab === "courses" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500">
            {courses.map(c => (
              <div key={c._id} className="bg-gray-900/20 border border-gray-800 p-5 rounded-[2.5rem] flex items-center justify-between group hover:bg-gray-900/40 transition-all border-l-4 border-l-orange-500">
                <div className="flex items-center gap-5 truncate">
                  <img src={c.thumbnail} className="w-20 md:w-28 h-14 object-cover rounded-2xl border border-gray-800" alt="" />
                  <div className="truncate">
                    <h3 className="font-bold text-sm md:text-base truncate group-hover:text-orange-500 transition-colors">{c.title}</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{c.instructor}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEditCourse(c)} className="p-3 bg-white/5 rounded-2xl hover:bg-orange-500 hover:text-black transition-all"><Edit3 size={16}/></button>
                  <button onClick={() => handleDeleteCourse(c._id)} className="p-3 bg-white/5 rounded-2xl hover:bg-red-600 transition-all"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- USERS TAB --- */}
        {activeTab === "users" && (
          <div className="bg-gray-900/20 border border-gray-800 rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-gray-900/50 text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] border-b border-gray-800">
                  <tr>
                    <th className="p-8">Learner Identity</th>
                    <th className="p-8">Clearance Role</th>
                    <th className="p-8">Access Status</th>
                    <th className="p-8 text-right">Terminal Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map(u => (
                    <tr key={u.clerkId} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="p-8 font-bold text-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 font-black">{u.name?.charAt(0)}</div>
                            <div>
                                <div className="text-gray-100">{u.name}</div>
                                <div className="text-[10px] text-gray-600 font-normal tracking-wide lowercase">{u.email}</div>
                            </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl ${u.role === 'admin' ? 'bg-orange-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                            {u.role?.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${u.isBlocked ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-green-500 shadow-[0_0_10px_green] animate-pulse'}`}></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase">{u.isBlocked ? "Revoked" : "Authorized"}</span>
                        </div>
                      </td>
                      <td className="p-8 text-right">
                        <button onClick={() => handleToggleBlock(u.clerkId, u.isBlocked)} className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl border transition-all ${u.isBlocked ? 'border-green-500/20 text-green-500 hover:bg-green-500 hover:text-black' : 'border-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-black'}`}>
                          {u.isBlocked ? "Restore Access" : "Terminate Access"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}