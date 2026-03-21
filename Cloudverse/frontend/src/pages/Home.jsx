import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";

export default function Home() {
  const { user } = useUser(); 

  const dummyRestaurants = [
    { id: 1, name: "Spicy Bella", cuisine: "Italian, Pizza", rating: 4.5, time: "30-40 min", img: "https://images.unsplash.com/photo-1604381756461-197cc0f2142d?q=80&w=800&auto=format&fit=crop" },
    { id: 2, name: "Burger Hub", cuisine: "American, Fast Food", rating: 4.2, time: "20-30 min", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <h1 className="font-extrabold text-2xl text-red-600">🍔 Cloudverse</h1>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold">Sign In</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 py-16 text-center">
        <h2 className="text-4xl font-extrabold mb-6">Discover the best food</h2>
      </div>

      {/* RESTAURANTS */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyRestaurants.map((res) => (
            <div key={res.id} className="bg-white rounded-xl shadow overflow-hidden border">
              <img src={res.img} alt={res.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h4 className="text-xl font-bold">{res.name}</h4>
                <p className="text-gray-500">{res.cuisine}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}