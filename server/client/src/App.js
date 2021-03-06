import React, { Component } from "react";
import "./App.css";
import Register from "./Components/Register/Register";
import Signin from "./Components/Signin/Signin";
import Navigation from "./Components/Navigation/Navigation";
import Post from "./Components/Post";
import axios from "axios";
import ForgetPassword from "./Components/ForgetPassword/ForgetPassword";
import Otp from "./Components/ForgetPassword/Otp";
import NewPassword from "./Components/ForgetPassword/NewPassword"



axios.defaults.withCredentials = true

class App extends Component {

  constructor() {
    super();

    this.state = {


      //To Route the between signin forms and dashboard
      route: 'signin',
      isSignedIn: false,
      changeEmail:'',
      user: {

        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''

      }

    }
  }



  //Function to load the user when register form is inputed(pass function to Register Component)
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined

    }})
  }

  

  
  //Function to Change Routes from Signin and Home Dashboard
  onRouteChange = (route) => {

    if (route === 'signout') {

      this.setState({isSignedIn: false});

    } else if (route === 'home') {

      this.setState({isSignedIn: true});
    }

    this.setState({route: route});
  }

  componentDidMount = () =>{
    axios.get("http://localhost:3001/", {withCredentials: true}).then((response) =>{
      console.log("app axios", response.data)
      if (response.data.loggedIn) {
        this.setState({user: response.data.sessionUser.user});
        this.onRouteChange ('home')
      } else if (response.data.OTP){
        this.onRouteChange ('otp')
      }
    })
  }
  render() {

    //Destructuring our states instead of using this.state
    const { isSignedIn, route, changeEmail} = this.state;

    return (
      <div className="App">

        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} loadUser={this.state.user}/>


        { /* Jsx Javascript expression to know when to change the route */

         route === 'home' ? //if this is true then route to home dashboard 

             <div>

                <h1>DASHBOARD</h1>
                <p>{this.state.user.name}</p>
                <div>
                  <Post onRouteChange={this.onRouteChange}/>
                </div>  
             </div>
           
           : (   //else if route is Signin go to Signin

             route === 'signin' || route === 'signout' ?

             <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
           :

             //else return the route to Register
             route === 'forgotPassword' ?
             <ForgetPassword loadUser={this.loadUser} onRouteChange={this.onRouteChange} />

           :

              //else return the route to Register
              route === 'otp' ?
              <Otp loadUser={this.loadUser} onRouteChange={this.onRouteChange} />

            :
              //else return the route to Register
              route === 'newPassword' ?
              <NewPassword email={this.state.changeEmail} onRouteChange={this.onRouteChange} />
      
            :
             //else return the route to Register

             <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
           )
        }
      </div>
    );
  }

}

export default App;
