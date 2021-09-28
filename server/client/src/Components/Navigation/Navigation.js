import React from 'react';
import Signin from "../Signin/Signin";
//Recieve the onRouteChange Prop from App.js and isSignedIn
const Navigation = ({ onRouteChange, isSignedIn, loadUser }) => {
        console.log('From navigation',loadUser)
        //If we are signedIn display the sign out navigation
        if (isSignedIn) {

            return(

                <nav style={{display: 'flex', justifyContent: 'space-around'}}>

                   <p onClick={() => onRouteChange('signout')} className='f3 link dim black underline pa3 pointer'>Sign Out</p>
                   <p className='f3 link dim black'>Sign In by: {loadUser.name} </p>

                </nav>
            );

        } else { //else if the user is not signedIn display 2 navigations: signin and register

            return(

               <nav style={{display: 'flex', justifyContent: 'flex-end'}}>

                 <p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign In</p>

                 <p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Regsiter</p>

               </nav>

            );
        }
        
}

export default Navigation;