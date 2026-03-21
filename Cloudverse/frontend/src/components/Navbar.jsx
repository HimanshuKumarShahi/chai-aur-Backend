import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between p-4 shadow">
      <Link to="/" className="font-bold text-xl">Cloudverse</Link>

      <div className="flex gap-4">
        <SignedOut>
          <SignInButton />
        </SignedOut>

        <SignedIn>
          <Link to="/cart">Cart</Link>
          <Link to="/admin">Admin</Link>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}