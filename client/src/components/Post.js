import React from 'react'
import axios from 'axios';
import './css/post.scss'
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"


class Post extends React.Component {
    owner = '';

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            update: false,
            delete: false,
            title: null,
            description: null,
            loaded: false
        };
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.title = React.createRef();
        this.description = React.createRef();
    }

    handleDelete(e) {
        e.preventDefault();
        axios.delete('/api/v1/posts/' + this.state.data._id, {headers: {Authorization: `Bearer ${this.props.auth}`}})
            .then(this.props.history.push('/posts'))
            .catch(err => {
                if (err.response) {
                    if (err.response.status === 401) return this.props.history.push('/401');
                    else if (err.response.status === 403) return this.props.history.push('/403');
                    else if (err.response.status === 404) return this.props.history.push('/404')
                }
                console.error(err);
            })
    }

    handleUpdate(e) {
        e.preventDefault();
        axios.put('/api/v1/posts/' + this.state.data._id, {
            title: this.title.current.value,
            description: this.description.current.value
        }, {headers: {Authorization: `Bearer ${this.props.auth}`}})
            .then(res => {
                this.setState({data: res.data, update: false});
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status === 401) return this.props.history.push('/401')
                    else if (err.response.status === 403) return this.props.history.push('/403')
                    else if (err.response.status === 404) return this.props.history.push('/404')
                }
                console.error(err);
            })
    }

    componentDidMount() {
        if (!this.state.data) {
            if (this.props.auth) {
                axios.get('/api/v1/me', {headers: {Authorization: `Bearer ${this.props.auth}`}})
                    .then(res => {
                        this.owner = res.data._id;
                    })
                    .catch(err => {
                        if (err.response) {
                            if (err.response.status === 401) return this.props.history.push('/401')
                            else if (err.response.status === 403) return this.props.history.push('/403')
                            else if (err.response.status === 404) return this.props.history.push('/404')
                        }
                        console.error(err);
                    });
            }
            axios.get('/api/v1/posts/' + this.props.match.params.id, {headers: {Authorization: `Bearer ${this.props.auth}`}})
                .then(res => {
                    this.setState({data: res.data[0], loaded: true});
                })
                .catch(err => {
                    if (err.response) {
                        if (err.response.status === 401) return this.props.history.push('/401')
                        else if (err.response.status === 403) return this.props.history.push('/403')
                        else if (err.response.status === 404) return this.props.history.push('/404')
                    }
                    console.error(err);
                });
        }
    }

    render() {
        if (!this.state.data) return null;
        return (
            <>
                {this.state.loaded === false &&
                <Loader
                    type="ThreeDots"
                    color="#1d3557"
                    height={100}
                    width={100}
                />
                }
                {!this.state.data &&
                <Loader
                    type="ThreeDots"
                    color="#1d3557"
                    height={100}
                    width={100}
                />
                }
                <div className="Post">
                    <div className="content">
                        <img style={{width: "350px", height: "auto"}} src={this.state.data.poster} alt="Poster Img"/>
                        <p><b>Title: </b>{this.state.data.title}</p>
                        <p><b>Descriprion: </b>{this.state.data.description}</p>
                        <p><b>Added at: </b><i>{this.state.data.addedAt}</i></p>
                        {this.state.update &&
                        <div id="update" className="modal">
                            <form className="modal-content animate" onSubmit={this.handleUpdate} action=""
                                  method="post">
                            <span onClick={() => this.setState({update: false})} className="close"
                                  title="Close Modal">&times;</span>
                                <div className="container">
                                    <label htmlFor="title"><b>Title </b></label>
                                    <input type="text" placeholder="Enter title" name="title"
                                           defaultValue={this.state.data.title} ref={this.title} maxLength="50"/>
                                    <label htmlFor="description"><b>Descriprion </b></label>
                                    <input type="text" defaultValue={this.state.data.description}
                                           ref={this.description} name="description"/>
                                    <button type="submit" className="submit">Update</button>
                                    <button type="button" onClick={() => this.setState({update: false})}
                                            className="cancelbtn">Cancel
                                    </button>
                                </div>

                            </form>
                        </div>
                        }
                        {this.state.delete &&
                        <div id="delete" className="modal">
                            <form className="modal-content animate" onSubmit={this.handleDelete} action=""
                                  method="post">

                            <span onClick={() => this.setState({delete: false})} className="close"
                                  title="Close Modal">&times;</span>
                                <div className="container">
                                    <h2>Are you sure you wanna delete this post?</h2>
                                    <button type="submit" className="submit">Delete</button>
                                    <button type="button" onClick={() => this.setState({delete: false})}
                                            className="cancelbtn">Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                        }

                        <span>
                        <button onClick={() => this.setState({update: true})} style={{width: "auto"}}>Update</button>
                        <button onClick={() => this.setState({delete: true})} style={{width: "auto"}}>Delete</button>
                    </span>

                    </div>
                </div>
            </>
        );
    }
}

export default Post
