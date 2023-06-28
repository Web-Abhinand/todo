import React, { useEffect } from 'react';
import {useContext,useState} from 'react';
import {auth} from '../firebase';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword} from "firebase/auth";
const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvieder({children}) {
    const[currentUser,setCurrentUser] = useState();
    const[loading,setLoading] = useState(true);
    
    function signup(email,password) {
        return createUserWithEmailAndPassword(auth,email,password)
    }

    function login(email,password) {
        return signInWithEmailAndPassword(auth,email,password)
    }

    function logout() {
        return auth.signOut()
    }

    useEffect(() => {
        const unsubsscribe=auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false);
        })
        return unsubsscribe;
    },[])

    const value = {
        currentUser,
        login,
        logout,
        signup
    }

  return (
    <AuthContext.Provider value={value}>
        {!loading&&children}
    </AuthContext.Provider>
  )
}
