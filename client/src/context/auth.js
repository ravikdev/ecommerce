import {useState,useEffect, useContext,createContext, children} from 'react'

const AuthContext = createContext();

//Creating state which we can access globally

const AuthProvider = ({children})=> {
    const [auth,setAuth] = useState({
        user:null,
        token:""
    })   

    useEffect(()=>{
        const data =localStorage.getItem("auth");
        if(data){
          const parseData = JSON.parse(data);
          setAuth({
            ...auth,
            user:parseData.user,
            token:parseData.token
          })
        }
        //eslint-disable-next-line
      },[])


    return(
        <AuthContext.Provider value ={[auth,setAuth]}>
            {children}
        </AuthContext.Provider>
    );
}

//custom Hook
const useAuth = () => useContext(AuthContext);

export {useAuth,AuthProvider};

