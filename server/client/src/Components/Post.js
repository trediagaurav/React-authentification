import React, { Component } from 'react'

export default class Post extends Component {
    constructor(props){
        super(props)

        this.state = {
            textarea:'',
        }
    }
    onTextChange = (event) => {
        this.setState({textarea: event.target.value})
    }

    onSubmit = () => {
        fetch('http://localhost:3001/text', {
            method: 'post',
            credentials:'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
               text: this.state.textarea
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("post", data)
            if (data.loggedIn === false) {
                this.props.onRouteChange('signout');
            }
        }) 
        .catch(err => this.props.onRouteChange('signout'));      
    }
    render() {
        return (
            <>
            <div className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 m-auto">
               
                <div className="mb-3">
                    <label for="exampleFormControlTextarea1" className="form-label">Example textarea</label>
                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" onChange={this.onTextChange} name="textarea"></textarea>
                </div>
                <button type="button" className="btn btn-primary" onClick={ this.onSubmit }>Submit</button>
            </div>
            <div>
                <p>
                    {this.state.textarea}
                </p>
            </div>
            </>
        )
    }
}
