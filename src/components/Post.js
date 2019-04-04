import React from 'react';
import {Card, CardText, CardHeader} from 'material-ui/Card';
import Divider from 'material-ui/Divider'
import Badge from 'material-ui/Badge';
import RaisedButton from 'material-ui/RaisedButton'
import Comments from './comments';
import {Row, Col} from 'react-flexbox-grid';
import HashtagX from './Hashtag.js';
import Gvote from './Gvote.js'
import Jvote from './Jvote.js'
const reactStringReplace = require('react-string-replace');

export default class Post extends React.Component {
    constructor(props) {
      super(props);
       this.state = {
            nickProp: this.props.nickProp, 
            textProp: this.props.textProp, 
            colorProp: this.props.colorProp, 
            G_upvote : this.props.G_upvoteProp,
            J_upvote: this.props.J_upvoteProp,
            comments: this.props.commentProp,
            image_src : this.props.image_prop,
            image_exists: "none",
            id : this.props.id_prop,
            timeStamp : this.props.ts_prop,
            timeAgo : "Just now" ,
            timeString: "Just now",
            noComments : 0,
            passPhrase : "herewego",
            openDialog : false,
            hashtag_posts : [],
            allow_g_vote : true,
            allow_j_vote : true,
        }
        this.construct_time = this.construct_time.bind(this);
      }

    componentWillMount () {
        this.construct_time();
        this.setState({
            noComments: this.state.comments.length
        })

        if (this.state.image_src) {
          this.setState({
            image_exists: "block"
          })
        }
    }
    
    /* Construct string displaying time ago since post */
    construct_time () {
        var ts = this.state.timeStamp;
        var testDate = new Date(ts*1000).toString().slice(0,21);
        var now = Date.now() / 1000;
        var diff = now - ts; 
        var old = false;
        if (diff > 24*3600) {
            old = true;
        }
        function time (s) {
            return new Date(s * 1e3).toISOString().slice(-13, -5);
        } 

        var timeString = ""
        var all = time(diff);
        var hoursAgo = all.slice(0,2); 
        if (parseInt(hoursAgo, 10) > 0) {
            timeString = timeString + hoursAgo + 'h';
        }
        var minutesAgo = all.slice(4,5);
        if (parseInt(minutesAgo, 10) > 0) {
            timeString = timeString + minutesAgo + 'm';
        } else {
            timeString = "Just now";
            var nicks = this.state.nickProp;
            return
        }
        timeString = timeString + " ago";
        var nick = this.state.nickProp;
        if (!old) {
            this.setState({
                timeString : timeString
            });
        } else {
            this.setState({
                timeString : testDate 
            })
        }
    }
  
    render () {
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
          backgroundColor : this.state.colorProp,
        }


        return (
        <div className="Post" style={{fontFamily: "Caveat", width: "100%", margin: 0 }}>
            <Card className="card" style={cardStyle}>
                <CardHeader id="card_header" style={headerStyle}
                  title={this.state.nickProp} 
                  subtitle={this.state.timeString}
                />
                <Divider />
                <CardText style={textStyle} >
                    <div >
                        <img style={{display: this.state.image_exists, width : "100%", height: "200px", borderRadius: "10%"}} src={this.state.image_src} alt="aff" />
                        {reactStringReplace(this.state.textProp, /#(\w+)/g, (match, i) => (
                            <HashtagX key={match + i} text_prop={match}> </HashtagX>
                        ))} 
                    </div>
                </CardText>
                <Divider />
                <div style={divStyle} >
                <Row>
                    <Col xs={3}>
                        <Gvote style={{divStyle}} id_prop={this.state.id} j_upvote_prop={this.state.J_upvote} g_upvote_prop={this.state.G_upvote} />
                    </Col>
                    <Col xs={3}>
                        <Jvote style={{divStyle}} id_prop={this.state.id} j_upvote_prop={this.state.J_upvote} g_upvote_prop={this.state.G_upvote} />
                    </Col>
                        <Col xs={6} style={{marginTop: 11}}>
                            <Comments parent_text_prop={this.state.textProp} parent_nick_prop={this.state.nickProp} parent_time_prop={this.state.timeString} id_prop= {this.state.id} commentProp = {this.state.comments}
                            color_prop={this.state.colorProp} image_prop={this.state.image_src} image_exists_prop={this.state.image_exists}> View </Comments>
                        </Col>
                </Row>
                </div>
            </Card>
        </div>
        );
    }
}

Post.defaultProps = {
    nickProp : "Gorg",
    textProp : "AFFFF",
    colorProp: "#ff66cc",
    socketProp : "",
    J_upvoteProp: 0,
    G_upvoteProp: 0,
    commentProp: [],
    id_prop: "",
    ts_prop : 0
}

