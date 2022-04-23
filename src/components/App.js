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
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
          updateProfile: (args) =>
            fAuth.updateProfile(user, {
              displayName: user.displayName,
              photoURL: user.photoURL,
            }),
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  });
  const refreshUser = () => {
    const user = fAuth.getAuth().currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL,
      updateProfile: (args) =>
        fAuth.updateProfile(user, {
          displayName: user.displayName,
          photoURL: user.photoURL,
        }),
    });
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={isLoggedIn}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
