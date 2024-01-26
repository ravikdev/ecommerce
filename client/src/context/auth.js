import {useState, useContext,createContext, children} from 'react'

const AuthContext = createContext();

//Creating state which we can access globally

const AuthProvider = ({children})=> {
    const [auth,setAuth] = useState({
        user:null,
        token:""
    })   
    return(
        <AuthContext.Provider value ={[auth,setAuth]}>
            {children}
        </AuthContext.Provider>
    );
}

//custom Hook
const useAuth = () => useContext(AuthContext);

export {useAuth,AuthProvider};

