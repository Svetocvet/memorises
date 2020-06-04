import React, {Component} from 'react'
import './css/about.scss'
import MyMap from './MyMap.js';
import img1 from '../localstorage/images/test1.jpg'

class About extends Component {
    render() {
        return (
            <>
                <h2>Some tips to connect with me:</h2>
                <div className="Map">
                    <MyMap/>
                    {!<MyMap/>&& <img style={{width: "350px", height: "auto"}} src={img1} alt="Poster Img"/>}
                </div>
                <p>Mail: svetocvet@yahoo.com</p>
            </>
        );
    }
}

export default About
