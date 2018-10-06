import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import fetch from 'isomorphic-fetch';
import Post from './Post.js'
import { Fade } from 'react-animation-components'

export default class PostList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            postList: [],
            endpoint: "127.0.0.1",
        };
        
        var options = {
            forceNew : true,
            timeout: 10000,
            autoConnect: true,
            transports:["polling"]
        }

        this.socket = socketIOClient("/", options);
        
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
            console.log("i got something");
            this.setState({
                postList: data
            });
            this.forceUpdate();
        }
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
        setTimeout(() => {
            console.log("Aff")
            this.setState({
                show_loader: "none"
            });
        }, 1500);
    }

    componentDidMount(){
        var myHeaders = new Headers();
          var myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
      };

      var myRequest = new Request('/posts', myInit);
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
      fetch('/posts', {
          method: 'GET',
          headers: {'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      })
      .then(function (res) {
          return res.json()
      })
      .then(function (json) {
          this.setState({
              postList : json
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
        id_prop = {post._id} ts_prop = {post.timeStamp} image_prop={post.img} hashtagProp={this.state.hashtag} />
    );

    return(
      <div>
        {listPosts}
      </div>
    )
  }
}

