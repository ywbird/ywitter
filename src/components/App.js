import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { fAuth } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(fAuth.getAuth().currentUser);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    fAuth.onAuthStateChanged(fAuth.getAuth(), (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
      console.log(user);
    });
  });
  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
