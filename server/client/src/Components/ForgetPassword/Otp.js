import React, { Component } from 'react'

export default class Otp extends Component {
    constructor(props){
        console.log(props)
        super(props)

        this.state = {

            signInEmail: '',

            otp: '',

            // signInPassword: '',

            // notRegister: '',

            // login:false,

            // store:null,

            // userData:''
        }
    }

    onEmailChange = (event) => {

        this.setState({signInEmail: event.target.value})
    }
    onOtpChange = (event) => {

        this.setState({otp: event.target.value})
    }
    onSubmit = () => {

        console.log(this.state.signInEmail);
        console.log(this.state.otp);

        fetch('http://localhost:3001/otp', {
            method: 'post',
            credentials:'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                otp: this.state.otp
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("data from sign", data)
            // if(data.mailsend){
            //     this.setState({notRegister: 'Mail Send'});
            // }else {
            //     this.setState({notRegister: 'You are not registered'});
            // }            
         
        })

        
    }
    render() {

        const { onRouteChange } = this.props

        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
    
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Enter OTP</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-black w-100" type="email" name="email-address" id="email-address" placeholder="Enter your email" onChange={this.onEmailChange} onKeyPress={event => {
                                if (event.key === 'Enter' && event.target.value.trim() > 0) {
                                this.onSubmit()
                                }
                            }} />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">OTP</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-black w-100" type="text" name="otp" id="otp" placeholder="Enter your otp" onChange={this.onOtpChange} onKeyPress={event => {
                                if (event.key === 'Enter' && event.target.value.trim() > 0) {
                                this.onSubmit()
                                }
                            }} />
                            </div>
                            {/* <label Name="pa0 ma0 lh-copy f6 pointer"><input type="checkbox" /> Remember me</label> */}
                        </fieldset>
                        <div className="">
                            <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Submit" disabled={(this.state.signInEmail === "") ? true : false } onClick={this.onSubmit} style={{borderRadius:"4px"}}/>
                        </div>
                        <div className="lh-copy mt3">
                            {/* <p onClick={ () => onRouteChange('signin')}  className="f6 link dim black db pointer">Sign In</p> */}
                            {(this.state.signInEmail === "") ? <div className="emptyFiledMsg"><span>Empty Fields</span></div> : null }
                        <div className=""><span>{this.state.notRegister}</span></div>
                        </div>
                    </div>
                </main>
            </article>
        )
    }
}
