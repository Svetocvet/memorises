import React from 'react'
import axios from 'axios'
import './css/new.scss'

class NewPost extends React.Component {
    url = '';

    constructor(props) {
        super(props);
        this.state = {
            cloudName: 'hlrzutjus',
            unsignedUploadPreset: 'lzhs5xdj',
            progress: 0,
            progressText: '',
            error: false,
            message: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.poster = React.createRef();
        this.title = React.createRef();
        this.description = React.createRef();
    }

    uploadFile(file) {
        let url = `https://api.cloudinary.com/v1_1/${this.state.cloudName}/upload`;
        let fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', this.state.unsignedUploadPreset);
        fd.append('folder', 'posters');
        axios.post(url, fd, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (e) => {
                let progress = Math.round((e.loaded * 100.0) / e.total);
                this.setState({progress: progress, progressText: progress + "% poster"});
            }
        })
            .then(res => {
                let obj = {title: this.title.current.value};
                obj.posterUrl = res.data.secure_url;
                obj.description = this.description.current.value;
                return axios.post('/api/v1/posts', obj, {headers: {Authorization: `Bearer ${this.props.auth}`}});
            })
            .then(res => {
                if (res) {
                    this.props.history.push('/posts/' + res.data._id);
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status === 401) return this.props.history.push('/401');
                    else if (err.response.status === 403) return this.props.history.push('/403');
                    else if (err.response.status === 404) return this.props.history.push('/404');
                }
                console.error(err);
            });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.title.current.value === '' || this.description.current.value === '' || !this.poster.current.files[0]) {
            this.setState({error: true, message: 'Please fill all fields'});
        } else if (this.title.current.value.length > 50) {
            this.setState({error: true, message: 'Too long title'});
        } else if (!this.poster.current.files[0].type.startsWith("image/")) {
            this.setState({error: true, message: 'Wrong file type'});
        } else {
            this.uploadFile(this.poster.current.files[0]);
        }
    }

    componentWillUnmount() {
        this.url = '';
    }

    render() {
        if (!this.props.auth) this.props.history.push('/401');
        const progress = this.state.progress !== 0;
        return (
            <div className="New">
                {this.state.error && <div className="alert alert-danger" id="alert">{this.state.message}</div>}
                <form action="/posts/new" method="POST" encType="multipart/form-data" id='form'
                      onSubmit={this.handleSubmit}>
                    <div className="line">

                        <label htmlFor="title">Title:</label>


                        <input type="text" id="title" name="title" placeholder="Title.." ref={this.title} required/>

                    </div>
                    <div className="line">

                        <label htmlFor="description">Description:</label>


                        <input type="text" id="description" name="description" placeholder="Description.."
                               ref={this.description} required/>
                    </div>

                    {progress &&
                    <div className="progress">
                        <div id="progress" className="progress-bar progress-bar-success progress-bar-striped"
                             role="progressbar" aria-valuenow={this.state.progress} aria-valuemin="0"
                             aria-valuemax="100" style={{width: this.state.progress + '%'}}>
                            {this.state.progressText}
                        </div>
                    </div>
                    }

                    <div className="form-group files">
                        <label>Upload your poster </label>
                        <input type="file" className="form-control" name="poster" id="poster" accept="image/*"
                               ref={this.poster} required/>
                    </div>
                    <div className="line">

                        <input type="submit" value="Submit" id="submit"/>
                    </div>
                </form>
            </div>
        );
    }
}

export default NewPost
