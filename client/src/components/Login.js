import React from 'react'
import axios from 'axios'
import './css/login.scss'
import {Link} from 'react-router-dom'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            message: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.username = React.createRef();
        this.password = React.createRef();
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.username.current.value === '') {
            this.setState({error: true, message: "please fill username"});
            event.target.reset();
        } else if (this.password.current.value === '') {
            this.setState({error: true, message: "please fill password"});
            event.target.reset();
        } else {
            event.persist();
            axios.post('/api/v1/login', {username: this.username.current.value, password: this.password.current.value})
                .then(res => {
                    localStorage.setItem('jwt', res.data.token);
                    this.props.eventEmitter.emit("auth", res.data.token);
                    this.props.history.push('/');
                })
                .catch(err => {
                    if (err.response) {
                        if (err.response.data.message) {
                            this.setState({error: true, message: err.response.data.message});
                            event.target.reset();
                        }
                    }
                    console.error(err.message);
                });
        }
    }


    render() {
        return (
            <div className="Login">
                <form action="/api/v1/login" method="POST" id="form" onSubmit={this.handleSubmit}>
                    <div className="container">
                        <h1>Log in</h1>
                        <hr/>
                        {this.state.error &&
                        <div className="alert alert-danger" id="alert">{this.state.message}</div>
                        }
                        <label htmlFor="username"><b>Username</b></label>
                        <input type="text" placeholder="Enter username" name="username" maxLength="50"
                               autoComplete="off"
                               ref={this.username} required/>

                        <label htmlFor="psw"><b>Password</b></label>
                        <input type="password" placeholder="Enter Password" name="password" maxLength="50"
                               autoComplete="off"
                               ref={this.password} required/>

                        <hr/>
                        <button type="submit" className="loginbtsn">Log in</button>
                    </div>
                    <div className="container signin">
                        <p>Don`t have account an account? <Link to="/register">Register here in</Link>.</p>
                    </div>
                </form>

            </div>

        );
    }
}

export default Login
