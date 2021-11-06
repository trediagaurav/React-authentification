import React, { Component } from 'react'
import {Button, Alert, Modal, ModalDialog} from "react-bootstrap";

export default class ForgetPassword extends Component {

    constructor(props){
        super(props)

        this.state = {

            signInEmail: '',

            otp: '',
            
            popup: false,

            form : true

        }
    }

    onEmailChange = (event) => {

        this.setState({signInEmail: event.target.value})
    }

    onSubmit = () => {
        fetch('http://localhost:3001/forgetpassword', {
            method: 'post',
            credentials:'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.mailSend === true){
                this.setState({notRegister: 'Mail Send'});
                this.setState({popup: true})
                this.setState({form: false})
            }else {
                this.setState({notRegister: 'You are not registered'});
            }      
        })
        .catch(err => this.setState({notRegister: 'You are not registered'}))   
    }

    close = () => {
        this.setState({popup: false})
        this.props.onRouteChange('otp');
    }
    render() {

        const { onRouteChange } = this.props

        return (
            <>
                {this.state.form && <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                    <main className="pa4 black-80">
                        <div className="measure">
                            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                                <legend className="f1 fw6 ph0 mh0">Forgot Password</legend>
                                <div className="mt3">
                                    <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                    <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-black w-100" type="email" name="email-address" id="email-address" placeholder="Enter your email" onChange={this.onEmailChange} onKeyPress={event => {
                                    if (event.key === 'Enter' && event.target.value.trim() > 0) {
                                    this.onSubmit()
                                    }
                                }} />
                                </div>
                                {/* <label Name="pa0 ma0 lh-copy f6 pointer"><input type="checkbox" /> Remember me</label> */}
                            </fieldset>
                            <div className="">
                                <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Send OTP" disabled={(this.state.signInEmail === "") ? true : false } onClick={this.onSubmit} style={{borderRadius:"4px"}}/>
                            </div>
                            <div className="lh-copy mt3">
                                <p onClick={ () => onRouteChange('signin')}  className="f6 link dim blue db pointer">Sign In</p>
                                {(this.state.signInEmail === "") ? <div className="emptyFiledMsg text-danger"><span>Empty Fields</span></div> : null }
                            <div className="text-danger"><span>{this.state.notRegister}</span></div>
                            </div>
                        </div>
                    </main>
                </article>}
                <div>
                    {this.state.popup && <Modal.Dialog className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                        <Modal.Body>
                            <p>OTP has been mailed and will expire in 5 minutes</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.close}>Close</Button>
                        </Modal.Footer>
                    </Modal.Dialog>}
                </div>
            </>
        )
    }
}
