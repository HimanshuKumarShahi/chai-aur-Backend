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
    <div className="bg-black text-white min-h-screen pb-20 selection:bg-orange-500/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 md:pt-20">
        {/* AVATAR HEADER */}
        <header className="flex flex-col items-center mb-12">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-900 rounded-full flex items-center justify-center border-4 border-orange-500/20 overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.1)]">
              {imgUploading ? (
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <img
                  src={user?.imageUrl || formData.profileImage}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              )}

              <label
                htmlFor="pfp-upload"
                className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              >
                <span className="text-xl">📸</span>
                <span className="text-[10px] font-black uppercase mt-1">
                  Edit Photo
                </span>
              </label>
            </div>
            <input
              type="file"
              id="pfp-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          <div className="text-center mt-6">
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase">
              {formData.name || user?.fullName}
            </h1>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </header>

        {/* FORM FIELDS */}
        <div className="space-y-8">
          <section className="bg-gray-900/30 border border-gray-800 p-6 md:p-10 rounded-[2rem]">
            <h2 className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
              Personal Identity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Full Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 text-sm focus:border-orange-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Mobile
                </label>
                <input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 text-sm focus:border-orange-500 outline-none transition-all"
                />
              </div>
            </div>
          </section>

          <section className="bg-gray-900/30 border border-gray-800 p-6 md:p-10 rounded-[2rem]">
            <h2 className="text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
              Professional Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["github", "leetcode", "portfolio", "twitter", "instagram"].map(
                (field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                      {field}
                    </label>
                    <input
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 text-sm focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                ),
              )}
            </div>
          </section>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={updateProfile}
              disabled={loading}
              className="flex-[2] bg-orange-500 text-black font-black py-5 rounded-2xl hover:bg-white transition-all uppercase tracking-widest text-sm"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
            <button
              onClick={() => signOut()}
              className="flex-1 px-8 py-5 border border-red-500/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all font-bold text-sm uppercase"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
