import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Badge from 'material-ui/Badge';
import CommentX from './comment.js';
import {Row, Col} from 'react-flexbox-grid';
import {Card, CardText, CardHeader} from 'material-ui/Card';
import Divider from 'material-ui/Divider'

//Internal classes
import Post from './Post.js';
import HashtagX from './Hashtag.js';

const reactStringReplace = require('react-string-replace');
var api_path = "https://gobberapi.jespercarlsson.com"

/* This class models all the comments of a single point */
export default class Comments extends React.Component {
    constructor(props) {
        super(props)
          this.state = {
            open: false,
            comments : [], 
            parentID : this.props.id_prop,
            parentColor : this.props.color_prop,
            textValue : "",
            nickValue : "",
            openDialog: false
          };
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.handleNickFieldChange = this.handleNickFieldChange.bind(this);
    }

  handleOpen = () => {
    this.setState({open: true});
        /* Fetch all comments belonging to this post */
      this.fetchComments();
  };

    componentWillMount() {
        this.fetchComments();
    }

    fetchComments = () => {
        var details = {
        'id': this.state.parentID
        };
        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        fetch(api_path + '/fetchcomments', {
            method: 'POST',
            headers: {'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'},
            body: formBody
          })
        .then(function (res) {
            return res.json()
        })
        .then(function (json) {
              this.setState({comments : json})
          }.bind(this))
          .catch((error) => {
            console.log(error);
          });
    
    }

  handleClose = () => {
    this.setState({open: false});
  };

  openDialog = () => {
    this.setState({
        openDialog : true
    })
  }
  
  closeDialog = () => {
    this.setState({
        openDialog : false 
    })
  }

    handleNickFieldChange (e) {
      this.setState({
        nickValue: e.target.value
      });
    }

     scrollToBottom() {
        this.el.scrollIntoView({ behavior: 'smooth' });
      }

    handleTextFieldChange (e) {
      this.setState({
        textValue: e.target.value
      });
    }
    /* Post a comment */
    leaveComment = () => {
        var details = {
            'nick' : this.state.nickValue,
            'comment': this.state.textValue,
            'id': this.state.parentID,
            'timeStamp' : Date.now() / 1000
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
            if (this.state.textValue !== "") {
                fetch(api_path + '/newcomment', {
                    method: 'post',
                    headers: {'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'},
                    body: formBody
                  })
                var oldcomments = this.state.comments;
                var rand = Math.random()*1000;
                var newComment = {
                    key : rand, 
                    nick : this.state.nickValue,
                    text: this.state.textValue,
                    parentID : this.state.parentID,
                    color: this.state.parentColor,
                    timeStamp : Date.now() / 1000
                }
                oldcomments.splice(0, 0, newComment);
                this.openDialog();
                setTimeout(this.closeDialog, 1000);
                this.setState({
                    comments: oldcomments,
                    textValue: "",
                    nickValue: ""
                });
            } else {
                console.log("Nothing to send!");
            }
    }     

  render() {
    const actions = [
        <Row>
        <RaisedButton
            onClick={this.leaveComment} 
            primary={true} 
            style={{marginLeft: "1px"}}
            label="Send" 
        />
      <RaisedButton
        style={{marginLeft: "5%"}}
        label="Cancel"
        onClick={this.handleClose}
      />,
    </Row>
    ];

    const comments = this.state.comments;
    const listComments = comments.map((comment) =>
            <CommentX key={comment._id} comment_prop = {comment.text}
                nick_prop={comment.nick} color_prop={this.state.parentColor}
                timestamp_prop={comment.timeStamp} />
    );

    const style = {
      padding:"2px",
      width:"100%",
      margin: 0
    }


    //For the post
       const textStyle = {
            textAlign: "center",
            color : "white",
            fontFamily: "Helvetica",
            padding: 10
        };

        var headerStyle = {
          textAlign: "left",
          padding: 10,
          color: "white"
        }

        var divStyle = {
          float : "center",
          margin : 0,
          padding : 0,
        }

        var cardStyle = {
          backgroundColor : this.props.color_prop,
        }


    return (
      <div>
        <RaisedButton style={{marginLeft: 15}} label="Comments" onClick={this.handleOpen} />
          <Badge
            badgeStyle={{ top:"0px", right:"28px", margin:"0"}}
            badgeContent={this.state.comments.length}
            primary={true}>
          </Badge>
        <Dialog
          actions={actions}
          modal={false}
          autoDetectWindowHeigh={true}
          autoDetectBodyContent={true}
          autoScrollBodyContent={true}
          repositionOnUpdate={true}
          open={this.state.open}
          bodyStyle={{padding:2}}
          titleStyle={{padding:2}}
          contentStyle={{width: "100%", padding:2}}
          fullWidth="true"
          onRequestClose={this.handleClose}
        >

   <div className="Post" style={{fontFamily: "Caveat", width: "100%", margin: 0 }}>
            <Card className="card" style={cardStyle}>
                <CardHeader id="card_header" style={headerStyle}
                  title={this.props.parent_nick_prop} 
                  subtitle={this.props.parent_time_prop}
                />
                <Divider />
                <CardText style={textStyle} >
                    <div >
                    <img style={{display: this.props.image_exists_prop, width : "100%", height: "200px", borderRadius: "10%"}} src={this.props.image_prop} />
                    {reactStringReplace(this.props.parent_text_prop, /#(\w+)/g, (match, i) => (
                        <HashtagX key={match + i} text_prop={match}> </HashtagX>
                    ))} 
                    </div>
                </CardText>
                <Divider />
                <div style={divStyle} >
                </div>
            </Card>
        </div>
            <h2 style={{textAlign: "center", fontFamily: "Caveat", margin: "3px"}}>Comments</h2>
                {listComments}
            <div style={style}>
                  <TextField value={this.state.nickValue} multiLine={false} onChange={this.handleNickFieldChange} hintText="Nick">
                    </TextField>
                    <TextField fullWidth={true} value={this.state.textValue} multiLine={true} onChange={this.handleTextFieldChange} hintText="Give comment">
                    </TextField>
                <Dialog
                  title="Info"
                  modal = {true}
                  open={this.state.openDialog}
                  onRequestClose={this.closeDialog}
                >
                  Sent comment!
                </Dialog>
            </div>
        </Dialog>
      </div>
    );
  }
}


Comments.defaultProps = {
    commentProp: ["Hej", "Pa", "Dig"]
}
