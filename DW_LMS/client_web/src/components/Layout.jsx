import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
}