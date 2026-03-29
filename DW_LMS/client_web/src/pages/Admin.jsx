import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import {
  PlusCircle,
  Users as UsersIcon,
  Video,
  FileText,
  CloudUpload,
  Trash2,
  Edit3,
  XCircle,
  CheckCircle,
  ShieldCheck,
  Database,
  Settings,
  Search,
  SlidersHorizontal,
  Loader2,
  ListTree,
  Target,
  Activity,
  ShieldAlert,
  BarChart3,
  Globe,
} from "lucide-react";

export default function Admin() {
  const { user, isLoaded } = useUser();

  const [activeTab, setActiveTab] = useState("create");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedFiles, setSelectedFiles] = useState({});
  const [fileUploading, setFileUploading] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [course, setCourse] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnail: "",
    instructor: "",
    category: "Tech",
    playlist: [],
    assignments: [],
    resources: [],
  });

  useEffect(() => {
    if (isLoaded && user) {
      fetchCourses();
      fetchUsers();
    }
  }, [user, isLoaded]);

  useEffect(() => {
    setSearchQuery("");
  }, [activeTab]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/course`);
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Courses Error:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/all`,
        {
          headers: { clerkid: user?.id },
        },
      );
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Users Error:", err);
    }
  };

  // --- 🔥 ANALYTICS LOGIC ---
  const stats = {
    totalUsers: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    courses: courses.length,
    active: users.filter((u) => !u.isBlocked).length,
    blocked: users.filter((u) => u.isBlocked).length,
  };

  const filteredCourses = (courses || []).filter(
    (c) =>
      (c.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.instructor || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredUsers = (users || []).filter(
    (u) =>
      (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) setSelectedFiles({ ...selectedFiles, [index]: file });
  };

  const uploadToCloudinary = async (index) => {
    const file = selectedFiles[index];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setFileUploading(index);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data", clerkid: user.id },
        },
      );
      const updatedResources = [...course.resources];
      updatedResources[index].fileUrl = res.data.url;
      setCourse({ ...course, resources: updatedResources });
      const newSelectedFiles = { ...selectedFiles };
      delete newSelectedFiles[index];
      setSelectedFiles(newSelectedFiles);
      alert("Asset Secured!");
    } catch (err) {
      alert("Upload Failed");
    } finally {
      setFileUploading(null);
    }
  };

  const handleRemoveResource = async (index) => {
    const resourceToDelete = course.resources[index];
    if (resourceToDelete?.fileUrl?.includes("cloudinary.com")) {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/upload/delete`,
          { url: resourceToDelete.fileUrl },
          { headers: { clerkid: user.id } },
        );
      } catch (err) {
        console.error("Cleanup Failed");
      }
    }
    const updatedResources = course.resources.filter((_, i) => i !== index);
    setCourse({ ...course, resources: updatedResources });
  };

  const addField = (type) => {
    const newField =
      type === "resources"
        ? { title: "", fileUrl: "", category: "PDF" }
        : type === "playlist"
          ? { title: "", videoUrl: "" }
          : { title: "", fileUrl: "" };
    setCourse({ ...course, [type]: [...(course[type] || []), newField] });
  };

  const handleArrayChange = (index, type, field, value) => {
    const updatedArray = [...course[type]];
    updatedArray[index][field] = value;
    setCourse({ ...course, [type]: updatedArray });
  };

  const removeField = (index, type) => {
    if (type === "resources") handleRemoveResource(index);
    else
      setCourse({
        ...course,
        [type]: course[type].filter((_, i) => i !== index),
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/api/course/${editId}`
        : `${import.meta.env.VITE_API_URL}/api/course/create`;
      await axios[isEditing ? "put" : "post"](url, course, {
        headers: { clerkid: user.id },
      });
      alert("System Updated!");
      resetForm();
      fetchCourses();
    } catch (err) {
      alert("Submit Error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCourse({
      title: "",
      description: "",
      videoUrl: "",
      thumbnail: "",
      instructor: "",
      category: "Tech",
      playlist: [],
      assignments: [],
      resources: [],
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleEditCourse = (c) => {
    setCourse({
      ...c,
      playlist: c.playlist || [],
      assignments: c.assignments || [],
      resources: c.resources || [],
    });
    setEditId(c._id);
    setIsEditing(true);
    setActiveTab("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleBlock = async (id, status) => {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/user/block/${id}`,
      { isBlocked: !status },
      { headers: { clerkid: user.id } },
    );
    fetchUsers();
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Delete course permanently?")) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/course/${id}`, {
        headers: { clerkid: user.id },
      });
      fetchCourses();
    }
  };

  if (!isLoaded)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="text-orange-500 animate-spin" size={40} />
      </div>
    );

  return (
    <div className="bg-[#050505] text-white min-h-screen p-4 md:p-8 pb-32 selection:bg-orange-500/30">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <h1 className="text-3xl font-black text-orange-500 uppercase italic tracking-tighter flex items-center gap-3">
            <Database className="text-orange-500" /> MASTER CONTROL
          </h1>
          <nav className="flex gap-2 bg-gray-900/50 p-1.5 rounded-2xl border border-gray-800">
            {["create", "courses", "users"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20" : "text-gray-500 hover:text-white"}`}
              >
                {t === "create" ? "Config" : t === "courses" ? "DB" : "Users"}
              </button>
            ))}
          </nav>
        </header>

        {/* ANALYTICS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gray-900/20 border border-gray-800 p-6 rounded-[2rem] group hover:border-orange-500/50 transition-all">
            <UsersIcon className="text-orange-500 mb-4" size={20} />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Population
            </p>
            <h3 className="text-3xl font-black italic mt-1">
              {stats.totalUsers}
            </h3>
          </div>
          <div className="bg-gray-900/20 border border-gray-800 p-6 rounded-[2rem] group hover:border-blue-500/50 transition-all">
            <ShieldCheck className="text-blue-500 mb-4" size={20} />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Admins
            </p>
            <h3 className="text-3xl font-black italic mt-1">{stats.admins}</h3>
          </div>
          <div className="bg-gray-900/20 border border-gray-800 p-6 rounded-[2rem] group hover:border-green-500/50 transition-all">
            <Globe className="text-green-500 mb-4" size={20} />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Active Nodes
            </p>
            <h3 className="text-3xl font-black italic mt-1">{stats.active}</h3>
          </div>
          <div className="bg-gray-900/20 border border-gray-800 p-6 rounded-[2rem] group hover:border-purple-500/50 transition-all">
            <Video className="text-purple-500 mb-4" size={20} />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Modules
            </p>
            <h3 className="text-3xl font-black italic mt-1">{stats.courses}</h3>
          </div>
        </div>

        {/* SEARCH BAR */}
        {activeTab !== "create" && (
          <div className="mb-8 relative max-w-xl group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder={
                activeTab === "courses"
                  ? "Search DB entries..."
                  : "Search user directory..."
              }
              className="w-full bg-gray-900/30 border border-gray-800 p-4 pl-12 rounded-2xl outline-none focus:border-orange-500 transition-all font-medium placeholder:text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* CONFIG TAB */}
        {activeTab === "create" && (
          <form
            onSubmit={handleSubmit}
            className="space-y-8 animate-in fade-in duration-500"
          >
            {/* 1. BASICS */}
            <div className="bg-gray-900/20 border border-gray-800 p-6 md:p-10 rounded-[3rem]">
              <h2 className="text-xl font-bold italic mb-8 flex items-center gap-2">
                <Settings size={20} className="text-orange-500" /> System Config
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Title"
                  className="admin-input-v2"
                  value={course.title}
                  onChange={(e) =>
                    setCourse({ ...course, title: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Instructor"
                  className="admin-input-v2"
                  value={course.instructor}
                  onChange={(e) =>
                    setCourse({ ...course, instructor: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="YouTube URL"
                  className="admin-input-v2"
                  value={course.videoUrl}
                  onChange={(e) =>
                    setCourse({ ...course, videoUrl: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Thumbnail URL"
                  className="admin-input-v2"
                  value={course.thumbnail}
                  onChange={(e) =>
                    setCourse({ ...course, thumbnail: e.target.value })
                  }
                  required
                />
                <select
                  className="admin-input-v2 md:col-span-2"
                  value={course.category}
                  onChange={(e) =>
                    setCourse({ ...course, category: e.target.value })
                  }
                >
                  {/* Core Tech */}
                  <option value="Tech">General Tech</option>
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="App Development">App Development</option>

                  {/* Languages */}
                  <option value="Python">Python</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Java">Java</option>
                  <option value="C++">C++</option>

                  {/* Frontend */}
                  <option value="React">React</option>
                  <option value="Next.js">Next.js</option>
                  <option value="HTML/CSS">HTML & CSS</option>

                  {/* Backend */}
                  <option value="Backend">Backend</option>
                  <option value="Node.js">Node.js</option>
                  <option value="Django">Django</option>
                  <option value="Spring Boot">Spring Boot</option>

                  {/* Advanced Tech */}
                  <option value="AI/ML">AI / Machine Learning</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="DevOps">DevOps</option>

                  {/* Tools */}
                  <option value="Git & GitHub">Git & GitHub</option>
                  <option value="Docker">Docker</option>
                  <option value="Kubernetes">Kubernetes</option>

                  {/* Other */}
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Business">Business</option>
                  <option value="Productivity">Productivity</option>
                </select>
                <textarea
                  placeholder="Description"
                  className="admin-input-v2 h-32 py-4 md:col-span-2"
                  value={course.description}
                  onChange={(e) =>
                    setCourse({ ...course, description: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* 2. CURRICULUM (PLAYLIST) */}
            <div className="bg-gray-900/20 border border-gray-800 p-6 md:p-10 rounded-[3rem]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-sm font-black text-orange-500 uppercase tracking-widest italic flex items-center gap-2">
                  <ListTree size={18} /> Curriculum
                </h2>
                <button
                  type="button"
                  onClick={() => addField("playlist")}
                  className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                >
                  + Add Lesson
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(course.playlist || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="relative bg-black/40 p-5 rounded-[1.5rem] border border-gray-800 group"
                  >
                    <input
                      placeholder="Lesson Title"
                      className="bg-transparent w-full text-sm font-bold outline-none border-b border-gray-800 mb-3"
                      value={item.title}
                      onChange={(e) =>
                        handleArrayChange(
                          idx,
                          "playlist",
                          "title",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      placeholder="YT Video URL"
                      className="bg-transparent w-full text-[10px] text-orange-500/50 outline-none"
                      value={item.videoUrl}
                      onChange={(e) =>
                        handleArrayChange(
                          idx,
                          "playlist",
                          "videoUrl",
                          e.target.value,
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeField(idx, "playlist")}
                      className="absolute top-4 right-4 text-gray-700 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. MISSION TASKS (ASSIGNMENTS) */}
            <div className="bg-gray-900/20 border border-gray-800 p-6 md:p-10 rounded-[3rem]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-sm font-black text-orange-500 uppercase tracking-widest italic flex items-center gap-2">
                  <Target size={18} /> Mission Tasks
                </h2>
                <button
                  type="button"
                  onClick={() => addField("assignments")}
                  className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                >
                  + New Task
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(course.assignments || []).map((a, i) => (
                  <div
                    key={i}
                    className="relative bg-black/40 p-5 rounded-[1.5rem] border border-gray-800 group"
                  >
                    <input
                      placeholder="Task Name"
                      className="bg-transparent w-full text-sm font-bold outline-none border-b border-gray-800 mb-3"
                      value={a.title}
                      onChange={(e) =>
                        handleArrayChange(
                          i,
                          "assignments",
                          "title",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      placeholder="Link"
                      className="bg-transparent w-full text-[10px] text-orange-500/50 outline-none"
                      value={a.fileUrl}
                      onChange={(e) =>
                        handleArrayChange(
                          i,
                          "assignments",
                          "fileUrl",
                          e.target.value,
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeField(i, "assignments")}
                      className="absolute top-4 right-4 text-gray-700 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. ASSET VAULT (RESOURCES) */}
            <div className="bg-gray-900/20 border border-gray-800 p-6 md:p-10 rounded-[3rem]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-sm font-black text-orange-500 uppercase tracking-widest italic flex items-center gap-2">
                  <FileText size={18} /> Asset Vault
                </h2>
                <button
                  type="button"
                  onClick={() => addField("resources")}
                  className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                >
                  + Sync Asset
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(course.resources || []).map((r, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-4 p-6 bg-black/40 border border-gray-800 rounded-[2rem] relative group border-l-4 border-l-orange-500"
                  >
                    <div className="flex gap-2">
                      <select
                        className="admin-input-v2 !py-2 !text-[10px] w-1/3"
                        value={r.category}
                        onChange={(e) =>
                          handleArrayChange(
                            i,
                            "resources",
                            "category",
                            e.target.value,
                          )
                        }
                      >
                        <option value="Book">📚 Book</option>
                        <option value="PDF">📄 PDF</option>
                        <option value="Image">🖼️ Image</option>
                      </select>
                      <input
                        placeholder="Name"
                        className="admin-input-v2 !py-2 !text-[11px] w-2/3"
                        value={r.title}
                        onChange={(e) =>
                          handleArrayChange(
                            i,
                            "resources",
                            "title",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        className="hidden"
                        id={`vault-${i}`}
                        onChange={(e) => handleFileChange(e, i)}
                      />
                      <label
                        htmlFor={`vault-${i}`}
                        className="flex-1 text-center p-3 bg-gray-900 border border-dashed border-gray-700 rounded-xl text-[10px] cursor-pointer hover:border-white transition-all text-gray-500 font-bold truncate"
                      >
                        {selectedFiles[i]
                          ? selectedFiles[i].name
                          : "Select Device File"}
                      </label>
                      {selectedFiles[i] && (
                        <button
                          type="button"
                          onClick={() => uploadToCloudinary(i)}
                          className="bg-orange-500 text-black p-3 rounded-xl hover:bg-white transition-all"
                        >
                          {fileUploading === i ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <CloudUpload size={18} />
                          )}
                        </button>
                      )}
                    </div>
                    {r.fileUrl && (
                      <p className="text-[9px] text-green-500 font-bold uppercase italic ml-1 tracking-widest">
                        ✅ Link Secured
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => removeField(i, "resources")}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-black py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.3em] shadow-2xl hover:bg-white transition-all active:scale-[0.98]"
            >
              {loading
                ? "Decrypting Buffer..."
                : isEditing
                  ? "Push Changes"
                  : "Deploy Entry"}
            </button>
          </form>
        )}

        {/* DB TAB */}
        {activeTab === "courses" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500">
            {filteredCourses.map((c) => (
              <div
                key={c._id}
                className="bg-gray-900/20 border border-gray-800 p-5 rounded-[2.5rem] flex items-center justify-between group border-l-4 border-l-orange-500 hover:bg-gray-900/40 transition-all"
              >
                <div className="flex items-center gap-5 truncate">
                  <img
                    src={c.thumbnail}
                    className="w-20 md:w-28 h-14 object-cover rounded-2xl border border-gray-800"
                  />
                  <div className="truncate">
                    <h3 className="font-bold text-sm md:text-base truncate group-hover:text-orange-500 transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 uppercase font-black">
                      {c.instructor}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEditCourse(c)}
                    className="p-3 bg-white/5 rounded-2xl hover:bg-orange-500 hover:text-black transition-all"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(c._id)}
                    className="p-3 bg-white/5 rounded-2xl hover:bg-red-600 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="bg-gray-900/20 border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-gray-900/50 text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] border-b border-gray-800">
                  <tr>
                    <th className="p-8">Learner</th>
                    <th className="p-8">Clearance</th>
                    <th className="p-8">Status</th>
                    <th className="p-8 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.clerkId}
                      className="hover:bg-white/[0.01] transition-colors group"
                    >
                      <td className="p-8 font-bold text-sm">
                        <div>{u.name}</div>
                        <div className="text-[10px] text-gray-600 lowercase font-normal">
                          {u.email}
                        </div>
                      </td>
                      <td className="p-8">
                        <span
                          className={`text-[10px] font-black px-3 py-1.5 rounded-xl ${u.role === "admin" ? "bg-orange-500 text-black" : "bg-gray-800 text-gray-500"}`}
                        >
                          {u.role?.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${u.isBlocked ? "bg-red-500 shadow-[0_0_5px_red]" : "bg-green-500 shadow-[0_0_5px_green]"}`}
                          ></div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase">
                            {u.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </div>
                      </td>
                      <td className="p-8 text-right">
                        <button
                          onClick={() =>
                            handleToggleBlock(u.clerkId, u.isBlocked)
                          }
                          className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl border transition-all ${u.isBlocked ? "border-green-500/20 text-green-500 hover:bg-green-500 hover:text-black" : "border-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-black"}`}
                        >
                          {u.isBlocked ? "Restore" : "Terminate"}
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
