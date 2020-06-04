import React from 'react'
import axios from 'axios'
import './css/register.scss'
import {Link} from 'react-router-dom'

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            message: '',
            validate: false,
            letter: "invalid",
            length: "invalid",
            capital: "invalid",
            number: "invalid",
            display: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.username = React.createRef();
        this.password = React.createRef();
        this.repeat = React.createRef();
        this.fullname = React.createRef();
        this.lowerCaseLetters = /[a-z]/g;
        this.upperCaseLetters = /[A-Z]/g;
        this.numbers = /[0-9]/g;
    }

    handleSubmit(event) {
        event.preventDefault();
        let length = this.username.current.value.length + this.password.current.value.length + this.repeat.current.value.length + this.fullname.current.value.length;
        if (this.username.current.value === '') {
            this.setState({error: true, message: "please fill username"});
            event.target.reset();
        } else if (this.password.current.value === '') {
            this.setState({error: true, message: "please fill password"});
            event.target.reset();
        } else if (this.repeat.current.value === '') {
            this.setState({error: true, message: "please fill repeat password"});
            event.target.reset();
        } else if (this.fullname.current.value === '') {
            this.setState({error: true, message: "please fill fullname"});
            event.target.reset();
        } else if (length > 200) {
            this.setState({error: true, message: "too long"});
            event.target.reset();
        } else if (this.state.letter === "invalid" || this.state.length === "invalid" || this.state.capital === "invalid" || this.state.number === "invalid") {
            this.setState({error: true, message: "please obey the rules"});
            event.target.reset();
        } else {
            event.persist();
            axios.post('/api/v1/register', {
                username: this.username.current.value,
                password: this.password.current.value,
                repeat: this.repeat.current.value,
                fullname: this.fullname.current.value
            })
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

    handleFocus() {
        this.setState({validate: true});
    }

    handleBlur() {
        this.setState({validate: false});
    }

    handleKeyUp() {
        if (this.password.current.value.match(this.lowerCaseLetters)) {
            this.setState({letter: "valid"});
        } else {
            this.setState({letter: "invalid"});
        }
        if (this.password.current.value.match(this.upperCaseLetters)) {
            this.setState({capital: "valid"});
        } else {
            this.setState({capital: "invalid"});
        }

        if (this.password.current.value.match(this.numbers)) {
            this.setState({number: "valid"});
        } else {
            this.setState({number: "invalid"});
        }

        if (this.password.current.value.length >= 8) {
            this.setState({length: "valid"});
        } else {
            this.setState({length: "invalid"});
        }
    }

    render() {
        return (
            <div className="Register">
                <form action="/api/v1/register" method="POST" id="form" onSubmit={this.handleSubmit}>
                    <div className="container">
                        <h1>Register</h1>
                        <p>Please fill in this form to create an account.</p>
                        <hr/>
                        {this.state.error &&
                        <div className="alert alert-danger" id="alert">{this.state.message}</div>
                        }
                        <label htmlFor="fullname"><b>Fullname</b></label>
                        <input type="text" id="fullname" placeholder="Enter fullname" name="fullname" autoComplete="off"
                               maxLength="50" ref={this.fullname} required/>

                        <label htmlFor="username"><b>Username</b></label>
                        <input type="text" placeholder="Enter username" name="username" maxLength="50"
                               autoComplete="off" ref={this.username} required/>

                        <label htmlFor="psw"><b>Password</b></label>
                        <input type="password" placeholder="Enter Password" name="password" maxLength="50"
                               autoComplete="off" onKeyUp={this.handleKeyUp} onBlur={this.handleBlur}
                               onFocus={this.handleFocus} ref={this.password} required/>

                        {this.state.validate &&
                        <div className="container" id="message">
                            <p id="letter" className={this.state.letter}>A <b>lowercase</b> letter</p>
                            <p id="capital" className={this.state.capital}>A <b>capital (uppercase)</b> letter</p>
                            <p id="number" className={this.state.number}>A <b>number</b></p>
                            <p id="length" className={this.state.length}>Minimum <b>8 characters</b></p>
                        </div>
                        }

                        <label htmlFor="psw-repeat"><b>Repeat Password</b></label>
                        <input type="password" placeholder="Repeat Password" name="repeat" maxLength="50"
                               ref={this.repeat} required/>

                        <hr/>
                        <button type="submit" className="registerbtn">Register</button>
                    </div>
                    <div className="container signin">
                        <p>Already have an account? <Link to="/login">Log in</Link>.</p>
                    </div>
                </form>
            </div>
        );
    }
}

export default Register
