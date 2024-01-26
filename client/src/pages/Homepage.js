import React from 'react'
import Layout from '../components/Layout/Layout'
// import { json } from 'express'
import { useAuth } from '../context/auth'
const Homepage = () => {
  const [auth,setAuth] = useAuth()
  return (
     <Layout tittle={'contact Us page'} >
      <h1>Homepage</h1>  
      <pre>{JSON.stringify(auth,null,4)}</pre>
     </Layout>                       
    )
}

export default Homepage
