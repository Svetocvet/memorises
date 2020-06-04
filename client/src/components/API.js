import React from 'react'
import './css/about.scss'

class API extends React.Component {
    render() {
        return (
            <div className="API">
                <h1>API</h1>
                <ul className="ApiList">
                    <li><a href="#users"><u>User</u></a></li>
                    <li><a href="#posts"><u>Posts</u></a></li>
                    <li><a href="#account"><u>Account</u></a></li>
                    <li><a href="#errors"><u>Errors</u></a></li>
                </ul>
                <h1 id="users">Users</h1>
                <h2 id="warning">Warning: you must have admin role</h2>
                <h2>Get users</h2>
                <p>Method: GET</p>
                <p>Url: /api/v1/users</p>
                <p>Params:</p>
                <table>
                    <tr>
                        <td>page (not required)</td>
                        <td>Get users by page</td>
                    </tr>
                    <tr>
                        <td>search (not required)</td>
                        <td>Get users by title or part of title</td>
                    </tr>
                </table>
                <p>Return: users(with pagination)</p>
                <h2>Add user</h2>
                <p>Method: POST</p>
                <p>Url: /api/v1/users</p>
                <p>Params:</p>
                <table>
                    <tr>
                        <td>username</td>
                        <td>Unique string</td>
                    </tr>
                    <tr>
                        <td>password</td>
                        <td>Very hard string</td>
                    </tr>
                    <tr>
                        <td>fullname</td>
                        <td>Some string</td>
                    </tr>
                </table>
                <p>Return: created user</p>
                <h2>Get one user by his id</h2>
                <p>Method: GET</p>
                <p>Url: /api/v1/users/:id</p>
                <p>Params: No params</p>
                <p>Return: user</p>
                <h2>Update one user by his id</h2>
                <p>Method: PUT</p>
                <p>Url: /api/v1/users/:id</p>
                <p>Params:</p>
                <table>
                    <tr>
                        <td>role</td>
                        <td>0(User) or 1(Admin)</td>
                    </tr>
                    <tr>
                        <td>fullname</td>
                        <td>Some string</td>
                    </tr>
                </table>
                <p>Return: No content</p>
                <h2>Delete one user by his id</h2>
                <p>Method: DELETE</p>
                <p>Url: /api/v1/users/:id</p>
                <p>Params: No params</p>
                <p>Return: No content</p>
                <h1 id="posts">Posts</h1>
                <h2>Get posts</h2>
                <p>Method: GET</p>
                <p>Url: /api/v1/posts</p>
                <p>Params:</p>
                <table>
                    <tr>
                        <td>page (not required)</td>
                        <td>Get posts by page</td>
                    </tr>
                    <tr>
                        <td>search (not required)</td>
                        <td>Get posts by title or part of title</td>
                    </tr>
                </table>
                <p>Return: posts(with pagination)</p>
                <h2>Add post</h2>
                <p>Method: POST</p>
                <p>Url: /api/v1/posts</p>
                <p>Params:</p>
                <table>
                    <tr>
                        <td>title</td>
                        <td>Some string</td>
                    </tr>
                    <tr>
                        <td>postUrl</td>
                        <td>url to some post</td>
                    </tr>
                    <tr>
                        <td>description</td>
                        <td>Some string</td>
                    </tr>

                </table>
                <p>Return: created post</p>
                <h2>Get one post by his id</h2>
                <p>Method: GET</p>
                <p>Url: /api/v1/posts/:id</p>
                <p>Params: No params</p>
                <h2>Update one post by his id</h2>
                <p>Method: PUT</p>
                <p>Url: /api/v1/posts/:id</p>
                <p>Params:</p>
                <table>
                    <tr>
                        <td>description</td>
                        <td>Some string</td>
                    </tr>
                    <tr>
                        <td>title</td>
                        <td>Some string</td>
                    </tr>
                </table>
                <p>Return: No content</p>
                <h2>Delete one post by his id</h2>
                <p>Method: DELETE</p>
                <p>Url: /api/v1/posts/:id</p>
                <p>Params: No params</p>
                <p>Return: No content</p>
                <p>Method of authorization: header must have field Authorization: Basic value(username:password in
                    Base64)</p>
                <h1 id="errors">Errors</h1>
                <p>400(username is already exist, page less then 0 or greater then pages</p>
                <p>401(You are not authorize)</p>
                <p>403(You are not admin)</p>
                <p>404(Not found)</p>
                <p>500(DataBase error)</p>
                <br></br>
            </div>
        );
    }
}

export default API
