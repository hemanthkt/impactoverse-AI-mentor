import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { supabase } from "./supabase";
import "./App.css";
import Chat from "./components/Chat";
import SignIn from "./auth/SignIn";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={!user ? <SignIn /> : <Navigate to="/" replace />}
        />
        <Route
          path="/"
          element={user ? <Chat /> : <Navigate to="auth" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;

{
  /* Add other routes here */
}
{
  /* <div className="relative w-full bg-[#09032e] overflow-hidden "> */
}
{
  /* Chat Component */
}
{
  /* <div className="relative z-20"> */
}
{
  /* <Chat /> */
}
{
  /* </div> */
}
{
  /* </div> */
}
