import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// --- 1. Animation Hook & Component (No external libraries needed) ---
const RevealOnScroll = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

// --- 2. Icons (Inline SVGs for copy-paste ease) ---
const ShieldIcon = () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>;
const ZapIcon = () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
const GlobeIcon = () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S13.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>;

// --- 3. Sub-Components ---
const CreditCardVisual = () => (
  <div className="relative mx-auto h-52 w-80 rotate-6 transform transition-transform duration-500 hover:rotate-0 md:h-64 md:w-96">
    <div className="absolute inset-0 rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 shadow-2xl backdrop-blur-2xl">
      <div className="mb-8 flex justify-between">
        <div className="h-10 w-14 rounded-lg bg-gradient-to-br from-yellow-200/80 to-yellow-500/80"></div>
        <div className="text-xl font-bold italic text-white/30">VISA</div>
      </div>
      <div className="mb-6 flex gap-4 text-2xl font-medium tracking-widest text-white/90">
        <span>••••</span><span>••••</span><span>••••</span><span>4288</span>
      </div>
      <div className="flex justify-between">
        <div>
          <p className="text-[10px] uppercase text-white/40">Card Holder</p>
          <p className="text-sm font-semibold text-white">Himanshu</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase text-white/40">Expires</p>
          <p className="text-sm font-semibold text-white">12/28</p>
        </div>
      </div>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10 hover:shadow-2xl hover:shadow-indigo-500/10">
    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300 transition-colors group-hover:bg-indigo-500 group-hover:text-white">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="mt-2 text-sm leading-relaxed text-white/60">{desc}</p>
  </div>
);

// --- 4. Main Page Component ---
export default function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen w-full bg-[#0B0F1A] text-white selection:bg-indigo-500/30">
      
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-4 pt-20 pb-10">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
          
          <div className="z-10 text-center lg:text-left">
            <RevealOnScroll>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                </span>
                Live Banking Demo
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={100}>
              <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
                The Future of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient">
                  Digital Banking.
                </span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <p className="mt-6 text-lg text-white/60 md:max-w-xl mx-auto lg:mx-0">
                Experience the next generation of financial dashboards. Real-time transactions, military-grade encryption, and a beautiful interface powered by the MERN stack.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
                {token ? (
                  <Link to="/dashboard" className="rounded-2xl bg-white px-8 py-4 text-sm font-bold text-black shadow-lg shadow-white/10 transition-transform hover:scale-105 hover:bg-gray-100">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="rounded-2xl bg-white px-8 py-4 text-sm font-bold text-black shadow-lg shadow-white/10 transition-transform hover:scale-105 hover:bg-gray-100">
                      Get Started Free
                    </Link>
                    <Link to="/login" className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-white/10">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </RevealOnScroll>
          </div>

          <div className="relative z-10 flex justify-center">
            <RevealOnScroll delay={400}>
              <CreditCardVisual />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ---------------- STATS SECTION ---------------- */}
      <section className="border-y border-white/5 bg-black/20 py-10 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            <RevealOnScroll delay={100}>
              <p className="text-3xl font-bold text-white">50K+</p>
              <p className="text-sm text-white/40">Active Users</p>
            </RevealOnScroll>
            <RevealOnScroll delay={200}>
              <p className="text-3xl font-bold text-white">$2M+</p>
              <p className="text-sm text-white/40">Transactions</p>
            </RevealOnScroll>
            <RevealOnScroll delay={300}>
              <p className="text-3xl font-bold text-white">99.9%</p>
              <p className="text-sm text-white/40">Uptime</p>
            </RevealOnScroll>
            <RevealOnScroll delay={400}>
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-sm text-white/40">Support</p>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES SECTION ---------------- */}
      <section className="py-32 px-4 relative">
        <div className="mx-auto max-w-7xl">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl font-bold text-white md:text-5xl">Everything you need to manage your wealth.</h2>
              <p className="mt-4 text-white/60">Powerful features wrapped in a simple, intuitive interface.</p>
            </div>
          </RevealOnScroll>

          <div className="grid gap-6 md:grid-cols-3">
            <RevealOnScroll delay={100}>
              <FeatureCard 
                icon={<ShieldIcon />} 
                title="Bank-Grade Security" 
                desc="Your data is protected with JWT authentication and advanced encryption standards." 
              />
            </RevealOnScroll>
            <RevealOnScroll delay={200}>
              <FeatureCard 
                icon={<ZapIcon />} 
                title="Instant Transfers" 
                desc="Send money to anyone, anywhere in the world instantly with zero hidden fees." 
              />
            </RevealOnScroll>
            <RevealOnScroll delay={300}>
              <FeatureCard 
                icon={<GlobeIcon />} 
                title="Global Access" 
                desc="Access your account from any device, anywhere in the world. Fully responsive." 
              />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="py-32 px-4 bg-gradient-to-b from-[#0B0F1A] to-black/40">
        <div className="mx-auto max-w-7xl">
          <RevealOnScroll>
            <h2 className="mb-20 text-center text-3xl font-bold text-white md:text-5xl">How it works</h2>
          </RevealOnScroll>

          <div className="grid gap-12 md:grid-cols-3 text-center md:text-left relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0"></div>

            <RevealOnScroll delay={100}>
              <div className="relative">
                <div className="mx-auto md:mx-0 mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#0B0F1A] bg-indigo-600 text-3xl font-bold text-white shadow-xl">
                  1
                </div>
                <h3 className="text-xl font-bold text-white">Register</h3>
                <p className="mt-2 text-white/50">Create an account in seconds using just your email.</p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <div className="relative">
                <div className="mx-auto md:mx-0 mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#0B0F1A] bg-indigo-600 text-3xl font-bold text-white shadow-xl">
                  2
                </div>
                <h3 className="text-xl font-bold text-white">Deposit</h3>
                <p className="mt-2 text-white/50">Add funds securely to your digital wallet instantly.</p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={500}>
              <div className="relative">
                <div className="mx-auto md:mx-0 mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#0B0F1A] bg-indigo-600 text-3xl font-bold text-white shadow-xl">
                  3
                </div>
                <h3 className="text-xl font-bold text-white">Transact</h3>
                <p className="mt-2 text-white/50">Send, receive, and track your money with ease.</p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ---------------- CTA SECTION ---------------- */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <RevealOnScroll>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 px-6 py-16 text-center shadow-2xl md:px-20">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-black/20 blur-3xl"></div>

              <h2 className="relative z-10 text-3xl font-bold text-white md:text-5xl">Ready to start your journey?</h2>
              <p className="relative z-10 mt-4 text-indigo-100">Join thousands of users who trust NeoBank for their daily financial needs.</p>
              
              <div className="relative z-10 mt-8">
                <Link to="/register" className="inline-block rounded-2xl bg-white px-8 py-4 text-base font-bold text-indigo-600 transition-transform hover:scale-105 hover:bg-indigo-50">
                  Create Free Account
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="border-t border-white/10 bg-[#050810] pt-20 pb-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white font-bold">₹</div>
                <span className="text-xl font-bold text-white">NeoBank</span>
              </div>
              <p className="mt-4 max-w-xs text-sm text-white/50">
                A secure, fast, and simple banking dashboard built for the modern web using the MERN stack.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white">Product</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/50">
                <li><Link to="#" className="hover:text-white">Features</Link></li>
                <li><Link to="#" className="hover:text-white">Security</Link></li>
                <li><Link to="#" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/50">
                <li><Link to="#" className="hover:text-white">About</Link></li>
                <li><Link to="#" className="hover:text-white">Careers</Link></li>
                <li><Link to="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 flex flex-col items-center justify-between border-t border-white/5 pt-8 md:flex-row">
            <p className="text-xs text-white/30">© 2026 NeoBank Inc. All rights reserved.</p>
            <div className="mt-4 flex gap-6 md:mt-0">
              <Link to="#" className="text-white/40 hover:text-white">Privacy</Link>
              <Link to="#" className="text-white/40 hover:text-white">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}