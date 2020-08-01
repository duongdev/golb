import React, { createContext, FC, useContext } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = (props) => {
  return (
    <AuthContext.Provider value={props.user}>
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const user = useContext(AuthContext)
  return user
}
