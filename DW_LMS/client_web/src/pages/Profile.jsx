import { useUser, useClerk } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [loading, setLoading] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    profileImage: "",
    portfolio: "",
    twitter: "",
    instagram: "",
    github: "",
    leetcode: "",
  });

  // Fetch from MongoDB on Load
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoaded || !user?.id) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/${user.id}`,
        );
        const dbUser = res.data;

        if (dbUser) {
          setFormData({
            name: dbUser.name || user.fullName || "",
            mobile: dbUser.mobile || "",
            profileImage: dbUser.profileImage || user.imageUrl || "",
            portfolio: dbUser.portfolio || "",
            twitter: dbUser.twitter || "",
            instagram: dbUser.instagram || "",
            github: dbUser.github || "",
            leetcode: dbUser.leetcode || "",
          });
        }
      } catch (err) {
        console.error("Profile Load Error:", err);
      }
    };
    fetchProfile();
  }, [user, isLoaded]);

  // IMAGE UPLOAD HANDLER
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return alert("File too large. Under 2MB only.");
    }

    try {
      setImgUploading(true);

      // ✅ 1. Update Clerk image
      await user.setProfileImage({ file });

      // 🔥 IMPORTANT: force refresh Clerk user
      await user.reload();

      // ✅ 2. Upload to your backend (Cloudinary)
      const data = new FormData();
      data.append("file", file);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            clerkid: user.id,
          },
        },
      );

      if (res.data?.url) {
        setFormData((prev) => ({
          ...prev,
          profileImage: res.data.url,
        }));
      }

      alert("✅ Profile photo updated!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setImgUploading(false);
    }
  };

  // PROFILE DATA HANDLER
  const updateProfile = async () => {
    try {
      setLoading(true);

      // 1. UPDATE CLERK NAME (Syncs the name in Navbar)
      const nameParts = formData.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await user.update({
        firstName: firstName,
        lastName: lastName,
      });

      // 2. UPDATE MONGODB
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/update/${user.id}`,
        formData,
      );

      alert("✅ Profile updated everywhere!");
    } catch (err) {
      console.error("Update Error:", err);
      alert("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isLoaded) return <div className="bg-black min-h-screen"></div>;

  return (
  <div className="min-h-screen bg-[#050505] text-white pb-24 selection:bg-orange-500/30">

    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 md:pt-16">

      {/* 🔥 PROFILE HEADER */}
      <div className="flex flex-col items-center text-center mb-12">

        <div className="relative group">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-orange-500/20 shadow-lg">
            {imgUploading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <img
                src={user?.imageUrl || formData.profileImage}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <label
            htmlFor="pfp-upload"
            className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer rounded-full"
          >
            <span className="text-xs font-bold uppercase">Change</span>
          </label>

          <input
            id="pfp-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        <h1 className="mt-5 text-2xl md:text-4xl font-black tracking-tight">
          {formData.name || user?.fullName}
        </h1>

        <p className="text-gray-500 text-xs mt-1">
          {user?.primaryEmailAddress?.emailAddress}
        </p>
      </div>

      {/* 🔥 FORM CONTAINER */}
      <div className="space-y-6">

        {/* 👤 PERSONAL INFO */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 md:p-8">
          <h2 className="text-sm font-bold text-orange-500 uppercase mb-6">
            Personal Info
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="input"
            />

            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="input"
            />

          </div>
        </div>

        {/* 🔗 SOCIAL LINKS */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 md:p-8">
          <h2 className="text-sm font-bold text-orange-500 uppercase mb-6">
            Social Links
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            {["github", "leetcode", "portfolio", "twitter", "instagram"].map((field) => (
              <input
                key={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field}
                className="input"
              />
            ))}

          </div>
        </div>

        {/* 🔥 ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">

          <button
            onClick={updateProfile}
            disabled={loading}
            className="flex-1 bg-orange-500 text-black py-4 rounded-xl font-bold text-sm hover:bg-white transition"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>

          <button
            onClick={() => signOut()}
            className="flex-1 border border-red-500 text-red-500 py-4 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition"
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  </div>
)}