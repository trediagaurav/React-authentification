import React from 'react';

//Recieve the onRouteChange Prop from App.js
class Signin extends React.Component {

    constructor(props){
        console.log(props)
        super(props)

        this.state = {

            signInEmail: '',

            signInPassword: '',

            notRegister: '',

            login:false,

            store:null,

            userData:''
        }
    }



    //Get value from email input
    onEmailChange = (event) => {

        this.setState({signInEmail: event.target.value})
    }

    //Get value from password input
    onPasswordChange = (event) => {

        this.setState({signInPassword: event.target.value})
    }

    
    //When the submit sign In button is clicked
    onSubmitSignIn = () => {

        //Send request to our server 
        fetch('http://localhost:3001/signin', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
        .then(response => response.json())
        .then(data => {
          if(data.user.id){
            this.props.loadUser(data.user);
            this.setState({userData:data.user})
          } else {
            this.setState({notRegister: 'You are not registered'});
          }
          if(data.accessToken){
              this.auth(data.accessToken)
            }     
        })        
    }

    auth = (e)=>{
        fetch('http://localhost:3001/authenticate', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${e}`
            },
        })
        .then(response => response.json())
        .then(data => {
            if(data){
                console.log("token received")
                localStorage.setItem('login',JSON.stringify({
                    login:true,
                    token:e,
                }))
                localStorage.setItem('userInfo',JSON.stringify({
                    user:data[0]
                }))                
                this.props.onRouteChange('home');
            }
            if (data.message) {
                console.log("token expire")
                localStorage.clear()
                // this.props.onRouteChange('signin');
            }
        })
    }
    storeCollector = (e) =>{
        let store = JSON.parse(localStorage.getItem('login'))
        let userInfo = JSON.parse(localStorage.getItem('userInfo'))
        if(store){
            this.auth(store.token)
        }       
        // console.log("user",user.user)
        if (userInfo && userInfo.user) { 
            if(store && store.login){
                this.props.onRouteChange('home');
                this.setState({store:store})
                this.props.loadUser(userInfo.user);
                console.log("Not expired yet")
                // this.props.loadUser(this.state.userData[0]);
            }
        }
        
    }
    async componentDidMount() {
       await this.storeCollector()
    }
    render(){

        const { onRouteChange } = this.props

        return (

            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
    
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address" id="email-address" placeholder="Enter your email" onChange={this.onEmailChange} onKeyPress={event => {
                            if (event.key === 'Enter' && event.target.value.trim() > 0) {
                              this.onSubmitSignIn()
                            }
                        }} />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input className=" pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password" id="password" placeholder="Enter your password" onChange={this.onPasswordChange} onKeyPress={event => {
                             if (event.key === 'Enter' && event.target.value.trim() > 0) {
                               this.onSubmitSignIn()
                               }
                            }} />
                        </div>
                        {/* <label className="pa0 ma0 lh-copy f6 pointer"><input type="checkbox" /> Remember me</label> */}
                    </fieldset>
                    <div className="">
                        <input onClick={ this.onSubmitSignIn } className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Sign in" disabled={(this.state.signInEmail === "" || this.state.signInPassword === "") ? true : false } onClick={this.onSubmitSignIn} style={{borderRadius:"4px"}}/>
                    </div>
                    <div className="lh-copy mt3">
                        <p onClick={ () => onRouteChange('register')}  className="f6 link dim black db pointer">Register</p>
                        {(this.state.signInEmail === "" || this.state.signInPassword === "") ? <div className="emptyFiledMsg"><span>Empty Fields</span></div> : null }
                       <div className=""><span>{this.state.notRegister}</span></div>
                        {/* <a href="#0" className="f6 link dim black db">Forgot your password?</a> */}
                    </div>
                </div>
            </main>
    
            </article>
    
        );

    }

    
}

export default Signin;