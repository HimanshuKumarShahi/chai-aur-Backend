import { useEffect, useState } from "react";
import api from "../api/api";

// --- Icons ---
const UserIcon = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const EnvelopeIcon = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>;
const ShieldCheckIcon = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.744c0 5.598 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>;
const FingerprintIcon = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.263m-1.302 1.466a7.482 7.482 0 01-5.13 1.771 7.482 7.482 0 01-5.13-1.771m11.562-10.998a10.5 10.5 0 01-10.5 10.5 10.5 10.5 0 01-10.5-10.5 10.5 10.5 0 0110.5-10.5 10.5 10.5 0 0110.5 10.5z" /></svg>;
const RefreshIcon = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;

// --- Components ---

const ProfileField = ({ icon: Icon, label, value, breakAll }) => (
  <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
      <Icon className="h-5 w-5" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-bold uppercase tracking-widest text-white/30">{label}</p>
      <p className={`mt-0.5 font-medium text-white ${breakAll ? "break-all" : "truncate"}`}>
        {value}
      </p>
    </div>
  </div>
);

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const fetchMe = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      console.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  // Generate a display initial
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center px-4 py-12">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[120px] pointer-events-none">
        <div className="h-96 w-96 rounded-full bg-indigo-600/30"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl">
        
        {/* Profile Card */}
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#12141C]/80 shadow-2xl backdrop-blur-xl">
          
          {/* Top Banner & Avatar Section */}
          <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-purple-700">
            <div className="absolute -bottom-12 left-8 flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-[#12141C] bg-white text-3xl font-black text-indigo-600 shadow-xl">
                {initial}
              </div>
              <div className="mb-2">
                <h2 className="text-xl font-bold text-white">{user?.name || "User Account"}</h2>
                <div className="flex gap-2">
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        Verified
                    </span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/50">
                        Member
                    </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="px-8 pt-16 pb-8">
            {!user ? (
               <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
                  <p className="text-white/40">Fetching profile...</p>
               </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <ProfileField icon={UserIcon} label="Display Name" value={user.name} />
                    <ProfileField icon={ShieldCheckIcon} label="Account Status" value="Active" />
                </div>
                
                <ProfileField icon={EnvelopeIcon} label="Email Address" value={user.email} />
                
                <ProfileField 
                    icon={FingerprintIcon} 
                    label="User Identity String" 
                    value={user._id} 
                    breakAll={true} 
                />

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={fetchMe}
                        disabled={loading}
                        className="group flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50"
                    >
                        <RefreshIcon className={`h-4 w-4 text-white/50 transition-transform ${loading ? "animate-spin" : "group-hover:rotate-180"}`} />
                        {loading ? "Refreshing..." : "Sync Profile Data"}
                    </button>
                    
                    <button
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-bold text-black transition-all hover:bg-gray-200 active:scale-95"
                    >
                        Edit Profile
                    </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Security Note */}
          <div className="border-t border-white/5 bg-white/5 px-8 py-4">
            <p className="text-center text-[10px] uppercase tracking-[0.2em] text-white/20">
              Data encrypted with 256-bit JWT standard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}