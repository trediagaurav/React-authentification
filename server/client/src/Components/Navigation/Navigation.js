import cookieParser from 'cookie-parser';
import React from 'react';
import axios from "axios";
import Signin from "../Signin/Signin";
//Recieve the onRouteChange Prop from App.js and isSignedIn
const Navigation = ({ onRouteChange, isSignedIn, loadUser }) => {
        //If we are signedIn display the sign out navigation
        const signOut = () =>{
            axios.post("http://localhost:3001/logout", {withCredentials: true}).then((response) =>{
                console.log("logout", response.data)
                if (response.data.loggedOut) {
                    onRouteChange('signout')
                    console.log("Logout", response)
                }else{
                    console.log("Error logging out")    
                }
                
            })
        }

        if (isSignedIn) {

            return(

                <nav style={{display: 'flex', justifyContent: 'flex-end', alignItems:'center'}}>

                   <p className='f3 link dim black pa3'>Sign In by: {loadUser.name} </p>
                   <p onClick={signOut} className='f3 link dim black underline pa3 pointer'>Sign Out</p>
                   

                </nav>
            );

        } else { //else if the user is not signedIn display 2 navigations: signin and register

            return(

               <nav style={{display: 'flex', justifyContent: 'flex-end'}}>

                 <p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer text-decoration-none'>Sign In</p>

                 <p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer text-decoration-none'>Register</p>

               </nav>

            );
        }
        
}

export default Navigation;