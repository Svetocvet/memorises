import React, {Component} from "react";
import "react-image-gallery/styles/scss/image-gallery.scss"
import './css/gallery.scss'
import axios from "axios";
import Loader from "react-loader-spinner";
import ImageGallery from 'react-image-gallery';

class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        axios.get("/api/v1/gallery")
            .then(res => {
                console.log(res.data);
                this.setState({data: res.data});
            })
            .catch(console.error);
    }

    render() {
        return (
            <div className="gallery">
                <h3>Here some random pictures from our user`s memories</h3>
                {!this.state.data[0] &&
                <Loader
                    type="ThreeDots"
                    color="#1d3557"
                    height={100}
                    width={100}
                />
                }
                <ImageGallery items={this.state.data}/>
            </div>

        )
    }
}

{/**/
}
export default Gallery
