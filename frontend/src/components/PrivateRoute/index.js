import React from "react"
import { Navigate} from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

export default function PrivateRoute({ children }) {
    // let  { currentUser } = useAuth();
    // let  { currentUser } = { name: "abc"};
  
    // if (!currentUser) {
      // return <Navigate to="/login"  replace />;
    // }
  
    return children;
}