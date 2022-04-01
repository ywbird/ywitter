import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { fAuth } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(fAuth.getAuth().currentUser);
  useEffect(() => {
    fAuth.onAuthStateChanged(fAuth.getAuth(), (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
      console.log(user);
    });
  });
  return (
    <>{init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing..."}</>
  );
}

export default App;
