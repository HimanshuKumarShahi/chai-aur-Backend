import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />
      
      {/* flex-grow ensures the footer stays at the bottom 
        even if the page content is short 
      */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}