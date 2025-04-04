import React, { useState } from "react";
import Card from "./Card";
import { supabase } from "../supabase";

function Nav() {
  const [showCard, setShowCard] = useState(false);

  const handleClick = () => {
    setShowCard(true);
  };
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
  };
  const userId = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user.id;
    console.log(userId);
  };

  return (
    <nav className="w-full h-1/12 bg-[#251952] z-50 p-4 border-amber-50 fixed navbar">
      <div className="scale-90 relative -top-2 -left-20">
        <div className="navBtn flex justify-between">
          <div className="navBtn-inner">
            <button className="text-white" onClick={handleClick}>
              ImpactoVerse
            </button>
          </div>
        </div>
      </div>
      {showCard && (
        <div className="scale-90">
          <Card
            handleClick={handleClick}
            showCard={showCard}
            setShowCard={setShowCard}
          />
        </div>
      )}
    </nav>
  );
}

export default Nav;
