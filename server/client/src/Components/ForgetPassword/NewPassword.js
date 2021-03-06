import React, { Component } from 'react'
import {Button,Modal} from "react-bootstrap";
import axios from "axios";

export default class ForgetPassword extends Component {

    constructor(props){
        super(props)
        this.state = {

            newPassword: '',

            confirmPassword: '',
            
            popup: false,

            form : true

        }
    }

    onPasswordChange = (event) => {

        this.setState({newPassword: event.target.value})
    }
    onConfirmPasswordChange = (event) => {

        this.setState({confirmPassword: event.target.value})
    }
    onSubmit = () => {

        fetch('http://localhost:3001/newpassword', {
            method: 'post',
            credentials:'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                newPassword: this.state.newPassword,
                confirmPassword: this.state.confirmPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.newPassword === true) {
                this.setState({popup: true})
                this.setState({form: false})
            }
            if(!data.newPassword) {   
                this.setState({notRegister: 'Password not match.'});
            }
            if(data.missingPassword === true){
                this.setState({notRegister: 'wrong credentials'});
            }   
        })
        .catch(err => this.setState({notRegister: 'wrong credentials'}))     
    }

    close = () => {
        this.setState({popup: false})
        this.props.onRouteChange('signin');
    }
   
    render() {

        const { onRouteChange } = this.props

        return (
            <>
                {this.state.form && <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                    <main className="pa4 black-80">
                        <div className="measure">
                            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                                <legend className="f1 fw6 ph0 mh0">New Password</legend>
                                <div className="mt3">
                                    <label className="db fw6 lh-copy f6" htmlFor="passwords">New Password</label>
                                    <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-black w-100" type="password" required name="newPassword" id="newPassword" placeholder="Enter new password" onChange={this.onPasswordChange} onKeyPress={event => {
                                    if (event.key === 'Enter' && event.target.value.trim() > 0) {
                                    this.onSubmit()
                                    }
                                }} />
                                </div>
                                <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Confirm password</label>
                                <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-black w-100" type="password"  required name="confirmPassword" id="confirmPassword" placeholder="Confirm new password" onChange={this.onConfirmPasswordChange} onKeyPress={event => {
                                if (event.key === 'Enter' && event.target.value.trim() > 0) {
                                this.onSubmit()
                                }
                            }} />
                            </div>
                            </fieldset>
                            <div className="">
                                <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Submit" disabled={(this.state.signInEmail === "") ? true : false } onClick={this.onSubmit} style={{borderRadius:"4px"}}/>
                            </div>
                            <div className="lh-copy mt3">
                                {(this.state.signInEmail === "") ? <div className="emptyFiledMsg"><span>Empty Fields</span></div> : null }
                            <div className="text-danger"><span>{this.state.notRegister}</span></div>
                            </div>
                        </div>
                    </main>
                </article>}
                <div>
                    {this.state.popup && <Modal.Dialog className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                        <Modal.Body>
                            <p>Password Changed successfully</p>
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
