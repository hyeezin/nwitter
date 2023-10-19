import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';
import { updateCurrentUser, updateProfile } from 'firebase/auth';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user){
        setIsLoggedIn(true);
        setUserObj(user);
      } else{
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = async() => {
    await updateCurrentUser(authService, authService.currentUser);
    setUserObj(authService.currentUser);
  }
  return (
    <>
      {init ?  (
        <AppRouter 
          refreshUser = {refreshUser}
          isLoggedIn = { isLoggedIn } 
          userObj={userObj} 
        />
      ) : ( 
        "Initializing..."
      )}
    </>
  );
}

export default App;
