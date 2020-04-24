import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton'
import Badge from 'material-ui/Badge';

var api_path = "http://gobberapi.jespercarlsson.com"

export default class Gvote extends Component {
    constructor(props) {
        super(props)
        this.state = ({
            G_upvote : this.props.g_upvote_prop,
            allow_g_vote : true
        })
    }

    give_G = () => {
        if (this.state.allow_g_vote) {
        var old_G = this.props.g_upvote_prop;
        var new_G = old_G + 1;
        var old_J = this.props.j_upvote_prop
        this.setState({
          G_upvote: new_G,
          allow_g_vote : false
        })
        var details = {
            'Gvotes': new_G,
            'Jvotes' : old_J,
            'id' : this.props.id_prop
        };
        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        fetch(api_path + '/updatepost', {
            method: 'post',
            headers: {'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'},
            body: formBody
          })
        } else {
          console.log("Already given G-vote!")
        }
    }

    /* Used to calculate which color G and J should have */
    calc_color(votes) {
        if (votes < 5) {
            return "white";
        } else if (votes >= 5 && votes < 10){
            return "yellow";
        } else if (votes >= 10 && votes < 20) {
            return "orange";
        } else {
            return "red";
        }
    }

    render() {
        var divStyle = {
          float : "center",
          margin : 0,
          padding : 0,
        }

        return (
          <Badge
            badgeStyle={{ padding: 0, top:"10px", right:"18px", margin:"0"}}
            badgeContent={this.state.G_upvote}
            primary={true}
          >
              <RaisedButton 
                buttonStyle={divStyle}
                style={{divStyle}}
                backgroundColor={this.calc_color(this.state.G_upvote)} label="G!" onClick={this.give_G}>  </RaisedButton>
            </Badge>
        )
    }
}
