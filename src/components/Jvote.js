import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton'
import Badge from 'material-ui/Badge';

var api_path = "http://gobberapi.jespercarlsson.com"

export default class Jvote extends Component {
    constructor(props) {
        super(props)
        this.state = ({
            J_upvote : this.props.j_upvote_prop,
            allow_j_vote : true
        })
    }

    give_J = () => {
        if (this.state.allow_j_vote) {
        var old_J = this.props.j_upvote_prop;
        var new_J = old_J + 1;
        var old_G = this.props.g_upvote_prop;
        this.setState({
          J_upvote: new_J,
          allow_j_vote : false
        })
        var details = {
              'Jvotes': new_J,
              'Gvotes' : old_G,
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
            badgeContent={this.state.J_upvote}
            primary={true}
          >
              <RaisedButton 
                buttonStyle={divStyle}
                style={{divStyle}}
                backgroundColor={this.calc_color(this.state.J_upvote)} label="J.." onClick={this.give_J}>  </RaisedButton>
            </Badge>
        )
    }
}
