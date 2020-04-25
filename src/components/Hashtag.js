import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Post from './Post.js';

var api_path = "https://gobberapi.jespercarlsson.com"

class HashtagX extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tag : this.props.text_prop,
            openDialog : false, 
            postList : []
        }
    }
    
    getPosts = () => {
        this.setState({
          openDialog : true
        })
        
        var get_url = api_path + "/posts?hashtag="+this.state.tag;
        fetch(get_url, {
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
            console.log(this.state);
          }.bind(this))
          .catch((error) => {
            console.log(error);
          });
    }

    handleClose = () => {
      this.setState({
          openDialog : false
      })
    }

    render() {
        const posts = this.state.postList;
        const listPosts = posts.map((post) => 
          <Post key={post._id} nickProp={post.nick} textProp={post.text} colorProp={post.color}
            J_upvoteProp = {post.Jvotes} G_upvoteProp = {post.Gvotes} 
            commentProp = {post.comments} socketProp = {this.state.socket}
            id_prop = {post._id} image_prop={post.img} ts_prop = {post.timeStamp} hashtagProp={this.state.hashtag} />
        );
        const actions = [
          <FlatButton
            label="Done"
            primary={true}
            keyboardFocused={true}
            onClick={this.handleClose}
          />,
        ];

        const divStyle={
          display: "inline-block"
        }

        return (
              <div style={divStyle} >
                <p style={{display: "inline-block"}} onClick={this.getPosts}>  <b> <u> #{this.state.tag} </u>  </b> </p>
                <Dialog
                  title={"Showing posts about #" + this.state.tag}
                  actions={actions}
                  modal = {false}
                  contentStyle={{width : '100%', transform: 'translate(0,0)'}}
                  bodyStyle={{padding:0}}
                  style={{paddingTop: 0, height: '100vh', borderTop:2}}
                  autoDetectWindowHeight={true}
                  autoDetectBodyContent={true}
                  autoScrollBodyContent={true}
                  repositionOnUpdate={true}
                  fullWidth="true"
                  open={this.state.openDialog}
                  onRequestClose={this.closeDialog}
                >
                  {listPosts}
                </Dialog>
              </div>
        );
    }
}

export default HashtagX

