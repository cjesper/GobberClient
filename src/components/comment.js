import React from 'react';
import {Card, CardText, CardHeader} from 'material-ui/Card';
import Divider from 'material-ui/Divider'
import HashtagX from './Hashtag.js';

const reactStringReplace = require('react-string-replace');

class CommentX extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment_nick: this.props.nick_prop,
            comment_text: this.props.comment_prop,
            comment_color: this.props.color_prop,
            comment_timestamp : this.props.timestamp_prop,
            comment_timeAgo: "Just now"
        }
    }

    componentWillMount() {
        var currTime = Date.now() / 1000; 
        var diff = (currTime - this.state.comment_timestamp);
        var timeAgo = "Just now";
        if (diff > 10 && diff < 120) {
            timeAgo = "Just now"
        } else if (diff > 120 && diff < 600) {
            timeAgo = "A few minutes ago"
        } else if (diff >= 600 && diff < 3600) {
            timeAgo = "About an hour ago"
        } else if (diff >= 3600 && diff < 86400) {
            timeAgo = "A few hours ago"
        } else if (diff > 86400) {
            timeAgo = "Days ago"
        }
        this.setState({
            comment_timeAgo : timeAgo 
        })
    }

  render () {
        const textStyle = {
            fontColor: "white",
            padding: "3px",
            color: "white",
            textAlign: "left",
        };
        
        var text = this.state.comment_text;
        var headerStyle = {
            fontColor:"white",
            color: "white",
            padding: "3px"
        }
        var cardStyle = {
            backgroundColor: this.state.comment_color,
            margin: "2px"
        }
        return (
        <div >
            <Card style={cardStyle}>
                <CardHeader
                    title={this.state.comment_nick}
                    subtitle={this.state.comment_timeAgo}
                    style={headerStyle} 
                    textStyle={headerStyle}
                />
                <Divider />
                <CardText style={textStyle} >
                    {reactStringReplace(text, /#(\w+)/g, (match, i) => (
                        <HashtagX key={match + i} text_prop={match}> </HashtagX>
                    ))} 
                </CardText>
            </Card>
        </div>
        );
    }
}

CommentX.defaultProps = {
    comment_text: "Default",
    comment_timestamp: "Just now",
    comment_nick: "Anon",
    commnet_color: "white"
}

export default CommentX;
