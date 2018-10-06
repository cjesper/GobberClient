import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import {Row, Col} from 'react-flexbox-grid';
import './App.css';

//Material-UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import BottomNavigation from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

//Internal
import WelcomeBar from './components/welcomeBar.js';
import NewPost from './components/NewPost.js';
import fetch from 'isomorphic-fetch';
import Post from './components/Post.js'
import Login from './components/Login.js'


var api_path = "http://gobberapi.carlssonjesper.com"

class Main extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            postList: [],
            display_posting_area : false,
            display_new_posts: "none",
            show_loader : "none",
        };

        
        this.socket = socketIOClient(api_path)
        this.socket.on('allPosts', function (data) {
            addMessage(data); 
        });
        
        this.socket.on('newPosts', function (data) {
            updates(data);
        });
        
        const updates = data => {
            console.log(data);
            var id = this.socket.id;
            if (id === data) {
                console.log("Same!");
            } else {
                this.setState({
                  display_new_posts: "block"
                });
            }
        }

        //Add new post on receipt
        const addMessage = data => {
            this.setState({
                postList: data
            });
            this.forceUpdate();
        }
        this.closeCallback = this.closeCallback.bind(this);
    }
   
    closeCallback = () => {
      this.setState({
        display_posting_area : false 
      });
    }

    show_post_area = () => {
      this.setState({
        display_posting_area : true 
      });
    }

    hide_post_area = () => {
      this.setState({
        display_posting_area : false 
      });
    }

    sendMessage = message => {
        this.socket.emit('postRequest', this.socket.id);
    }
    
    //Request new posts from backend
    requestNewPosts = () => {
        this.setState({
            display_new_posts: "none",
            show_loader: "block"
        });
        this.sendMessage();
        var int = setTimeout(() => {
            console.log("Aff")
            this.setState({
                show_loader: "none"
            });
        }, 1500);
    }

    componentWillMount(){
        this.fetchPosts();
    }

    fetchPosts = () => {
      var query = {
        hashtag : ""
      };
      var formBody = [];
      for (var property in query) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(query[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
          axios.get(api_path+"/posts")
          .then(function (res) {
              console.log(res);
              this.setState({
                  postList : res.data 
              })
            }.bind(this))
            .catch((error) => {
              console.log(error);
            });
        }


  render() {
    const posts = this.state.postList;
    const listPosts = posts.map((post) => 
      <Post key={post._id} nickProp={post.nick} textProp={post.text} colorProp={post.color}
        J_upvoteProp = {post.Jvotes} G_upvoteProp = {post.Gvotes} 
        commentProp = {post.comments} socketProp = {this.state.socket}
        id_prop = {post._id} ts_prop = {post.timeStamp} image_prop={post.img} hashtagProp={this.state.hashtag}> </Post>
    );

    const children = [
                        <NewPost style={{ zIndex: 1}} 
                            key={"SomeKey"}
                            socket={this.socket} 
                            callback={this.closeCallback}
                            />,
                    <RaisedButton 
                            key={1241241}
                            label="Close"
                            secondary={false}
                            style={{marginLeft: "10px"}}
                            onClick={this.hide_post_area}
                        > </RaisedButton>
    ]
    const paperStyle = {
      zIndex: 100, 
      height: "75px",
      width: "75px",
      position: "fixed",
      bottom: "5%",
      left: "77%"
    }

    const paperChildren = [
        <img src="https://png.icons8.com/metro/50/000000/pencil.png" 
          style={{
            position: "absolute",
            left: "10px",
            top: "5px"
          }}
        />
    ]
    return (
        <MuiThemeProvider>
            <div style={{maxWidth: "100%", zIndex: 1, position: "relative", margin: "auto"}}>
                <div style={{margin: "auto"}}>
                <WelcomeBar />
                    <Dialog 
                      title="New post"
                      modal={false}
                      open={this.state.display_posting_area}
                      autoDetectWindowHeight={true}
                      autoDetectBodyContent={true}
                      autoScrollBodyContent={true}
                      repositionOnUpdate={false}
                      style={{
                          width: "100%", 
                          maxWidth : "800px",
                          height: "100%",
                          position: 'fixed',
                      }}
                      children={children}
                      bodyStyle={{padding:"5px", minHeight: "250px"}}
                      titleStyle={{
                          textAlign: "center", 
                          padding:0,
                          fontFamily: "Caveat"}}
                      contentStyle={{width: "100%", maxWidth: "none", 
                                    height: "100%", maxHeight: "none",
                                    marginTop: "-160px", padding:2,
                                    overflowY: "auto"}}
                      fullWidth="true"
                    >
                    </Dialog>
                <i style={{display: this.state.show_loader, position: "absolute", zIndex: 10, marginLeft : "45%", marginTop: "45%", fontSize: "36px"}} className="fa fa-spinner fa-spin"> </i>
                <div onClick={this.requestNewPosts} style={{zIndex: 1, display: this.state.display_new_posts, borderRadius: "5%", color: "white", backgroundColor: "blue", width: "100%", height: "25px", textAlign: "center",
                    }}> 
                  <b> Load new posts </b>
                </div>
                <div>
                    {listPosts} 
                </div>
                <Paper
                  id="colorPick"
                  style={paperStyle}
                  zDepth={3}
                  onClick={this.show_post_area}
                  circle={true}
                  children={paperChildren}
                />
                </div>
            </div>
        </MuiThemeProvider>
    );
  }
}

export default Main;
