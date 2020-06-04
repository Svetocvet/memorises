import React from 'react';
import AwesomeSlider from 'react-awesome-slider';
import AwesomeSliderStyles from 'react-awesome-slider/src/styles.js';
import About from './About';
import Auhorize from './Authorize';
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import PageNotFound from './PageNotFound';
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import {EventEmitter} from 'events';
import Posts from './Posts';
import Post from './Post';
import NewPost from './NewPost';
import Home from './Home';
import Gallery from './Gallery';

import Forbidden from './Forbidden';
import Header from "./Header";
import API from './API';

import img1 from '../localstorage/images/test1.jpg'
import img2 from '../localstorage/images/test2.jpg'
import img3 from '../localstorage/images/test3.jpg'
import img4 from '../localstorage/images/test4.jpg'
import img5 from '../localstorage/images/test5.jpg'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: localStorage.getItem('jwt'),
            id: null
        };
        this.handler = this.handler.bind(this);
        this.eventEmitter = new EventEmitter();
    }

    handler(auth) {
        this.setState({auth: auth})
    }

    componentDidMount() {
        this.eventEmitter.addListener("auth", this.handler);
    }

    componentWillUnmount() {
        this.eventEmitter.removeListener("auth", this.handler);
    }

    render() {
        return (
            <div className="App">
                <div className="TopBlock">
                    <AwesomeSlider style={{height: "220px", width: "100%", minWidth: "360px"}}
                                   cssModule={AwesomeSliderStyles}>
                        <div data-src={img2}/>
                        <div data-src={img4}/>
                        <div data-src={img3}/>
                        <div data-src={img5}/>
                        <div data-src={img1}/>
                    </AwesomeSlider>
                    <Router>
                        <Header key={this.state.auth} eventEmitter={this.eventEmitter} auth={this.state.auth}/>
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route path="/about" component={About} />
                            <Route exact path="/gallery" component={Gallery} />
                            <Route path="/posts/new" render={(props) => <NewPost auth={this.state.auth} {...props} />} />
                            <Route path="/posts/:id" render={(props) => <Post auth={this.state.auth} {...props} />} />
                            <Route path="/posts" render={(props) => <Posts auth={this.state.auth} {...props} />} />
                            <Route path="/login" render={(props) => <Login eventEmitter={this.eventEmitter} {...props} />} />
                            <Route path="/register" component={(props) => <Register eventEmitter={this.eventEmitter}{...props} />} />
                            <Route path="/developer" component={API} />
                            <Route path="/401" component={Auhorize} />
                            <Route path='/403' component={Forbidden} />
                            <Route path="*" component={PageNotFound} />
                        </Switch>

                    </Router>
                    <Footer/>
                </div>

            </div>
        );
    }
}

export default App;
