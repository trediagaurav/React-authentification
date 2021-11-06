import React from 'react';
import {Button} from 'react-bootstrap'
import './Register.css';


//RegEx to validate Email
const validEmailRegex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);



//Recieve the onRouteChange Prop from App.js
class Register extends React.Component {

    constructor(props){

        super(props)

        this.state = {

            email: '',

            password: '',

            name: '',

            notRegister: '',

            store:null,

            userData:''
        }
    }


    //Get value from name input
    onNameChange = (event) => {

        this.setState({name: event.target.value})
    }


    //Get value from email input
    onEmailChange = (event) => {

        this.setState({email: event.target.value})
    }

    //Get value from password input
    onPasswordChange = (event) => {

        this.setState({password: event.target.value})
    }


    //When the submit Register button is clicked
    onSubmitSignIn = () => {

        //Send request to our server 
        fetch('http://localhost:3001/register', {
            method: 'post',
            credentials:'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.user.id) {

                //Load new user
                this.props.loadUser(data.user)

                //Change the route to home
                this.props.onRouteChange('home') 
            } else {
                this.setState({notRegister: 'Already registered'});
            }
        })
        .catch(err => this.setState({notRegister: 'Already registered'}))
        
    }

    render(){

        // const { onRouteChange } = this.props

        return (

            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
    
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Register</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-black w-100" type="text" name="name" id="name"  placeholder="Enter name (max 8 characters)" required onChange={this.onNameChange} required autoComplete="off"/>
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-black w-100" type="email" name="email-address" id="email-address" placeholder="Enter your email" required onChange={this.onEmailChange} required autoComplete="off"/>
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input className=" pa2 input-reset ba bg-transparent hover-bg-black hover-black w-100" type="password" name="password" id="password" placeholder="Enter your password" required onChange={this.onPasswordChange} required autoComplete="off"/>
                        </div>
                        {/* <label className="pa0 ma0 lh-copy f6 pointer"><input type="checkbox" /> Remember me</label> */}
                    </fieldset>
                    <div className="">
                        {/* <input onClick={ this.onSubmitSignIn } className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Register" disabled={(this.state.name === "" || this.state.name.length > 8 || this.state.email === "" || !validEmailRegex.test(this.state.email) || this.state.password === "") ? true : false } /> */}
                        <input onClick={ this.onSubmitSignIn } className="RegisterButton" type="submit" value="Submit" disabled={(this.state.name === "" || this.state.email === "" || !validEmailRegex.test(this.state.email) || this.state.password === "") ? true : false }/>

                        {(this.state.name === "" || this.state.name.length > 8 || this.state.email === "" || !validEmailRegex.test(this.state.email) || this.state.password === "") ? <div className="emptyInpMsg text-danger"><span>Fill all the Credentials</span></div> : null }
                        <div className="emptyInpMsg text-danger" ><span>{this.state.notRegister}</span></div>

                    </div>
                </div>
            </main>
    
            </article>
    
        );
    }

    
}

export default Register;