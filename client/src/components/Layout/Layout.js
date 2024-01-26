import React from 'react';
import Header from './Header';
import Footer from './Footer';
import {Helmet} from 'react-helmet'
import toast, { Toaster } from 'react-hot-toast';

const Layout = ({children,title,discription,keywords,author}) => {
  return (
    <div>
       <Helmet>
                <meta charSet="utf-8" />
                <title>{title}</title>
                <meta name="description" content={discription}/>
                <meta name="keywords" content={keywords}/>
                <meta name="author" content={author}/>
        </Helmet>
      <Header />
      <Toaster />
         <main> {children} </main>
      <Footer />
    </div>
  );
};

//OR
// const Layout = ({children}) => {
//   return (
//     <div>
//        <Helmet>
//                 <meta charSet="utf-8" />
//                 <title>{props.title}</title>
//                 <meta name="description" content={props.discription}/>
//                 <meta name="keywords" content={props.keywords}/>
//                 <meta name="author" content={props.author}/>
//         </Helmet>
//       <Header />
//       <Toaster />
//       <main>  {children} </main>
//       <Footer />
//     </div>
//   );
// };


Layout.defaultProps = {
  title: "Ecommerce app ",
  description:"mern stack project",
  keywords:"mern,react, mongodb",
  author:"Ravi"
}


export default Layout;
