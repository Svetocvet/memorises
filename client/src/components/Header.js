import React from "react";
import axios from "axios";
import {Link, withRouter} from "react-router-dom";
import {Dropdown, DropdownButton, Nav, Navbar} from 'react-bootstrap';


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            auth: this.props.auth
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        if (this.state.auth && !this.state.data) {
            const jwt = localStorage.getItem('jwt');
            axios.get("/api/v1/me", {headers: {Authorization: `Bearer ${jwt}`}})
                .then(res => {
                    this.setState({data: res.data});
                })
                .catch(console.error);
        }
    }

    handleClick(event) {
        event.preventDefault();
        localStorage.removeItem('jwt');
        this.setState({data: null});
        this.props.eventEmitter.emit("auth", null);
        this.props.history.push('/');
    }

    render() {
        return (
            <Navbar bg="light" style={{backgroundColor: '#457b9d'}}>
                <Navbar.Brand href="/"><Link to="/">Memorise</Link></Navbar.Brand>
                <Nav className="mr-auto" style={{flexDirection: "row"}}>
                    <Nav.Link><Link to="/">Home</Link></Nav.Link>
                    <Nav.Link><Link to="/gallery">Gallery</Link></Nav.Link>
                    <Nav.Link><Link to="/about">About</Link></Nav.Link>

                    {this.state.auth && this.state.data ? (
                        <>
                            <Nav.Link><Link to="/posts">Posts</Link></Nav.Link>

                            <Nav.Link onClick={this.handleClick}><Link
                                to="/logout">Logout</Link></Nav.Link>
                        </>
                    ) : (
                        <DropdownButton id="dropdown-basic-button" title="Sign In">
                            <Dropdown.Item><Link to="/login">Login</Link></Dropdown.Item>
                            <Dropdown.Item><Link to="/register">Register</Link></Dropdown.Item>
                        </DropdownButton>
                    )}
                </Nav>
            </Navbar>
        );
    }
}

export default withRouter(Header);
