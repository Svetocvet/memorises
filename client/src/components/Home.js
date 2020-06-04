import React from 'react'
import './css/home.scss'
import {Link} from "react-router-dom";

class Home extends React.Component {
    render() {
        return (
            <div className="Home">
                <h1>Memorises</h1>
                <div className="mem-content">
                    <p>Greetings on the website, here you can keep the memories that are dear to you.
                        Our site also has an <Link classname="link" to="/developer"><u>API</u></Link>.</p>
                    <p>I have nothing more to add, so let`s look at the funny pictures.</p>
                    <br></br>
                    <img src="https://starecat.com/content/wp-content/uploads/programming-pro-tip-code-javascript-underwater-so-nobody-could-see-you-crying.jpg"/>
                    <br></br>
                    <img src="https://i.imgflip.com/2kuh6f.jpg"/>
                    <br></br>
                    <img src="https://hookagency.com/wp-content/uploads/2016/04/website-is-done-meme.jpg.webp"/>
                    <br></br>
                    <img src="https://media.proglib.io/wp-uploads/2019/06/global-state.jpeg"/>
                    <br></br>
                </div>
            </div>
        );
    }
}

export default Home
