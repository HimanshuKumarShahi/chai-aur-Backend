import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";

export default function ProtectedRoute({ children }) {

  return (

    <>
      <SignedIn>
        {children}
      </SignedIn>

      <SignedOut>
        <SignIn />
      </SignedOut>
    </>

  );
}