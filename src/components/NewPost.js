import React from 'react';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton'
import '../css/NewPost.css'
import NewCamera from './NewCamera.js'
import {Row, Col} from 'react-flexbox-grid';
import AutoComplete from 'material-ui/AutoComplete';

var api_path = "http://gobberapi.jespercarlsson.com"

class NewPost extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        nickValue : "",
        textValue : "",
        passValue : "",
        imgValue: "",
        blobData : null,
        preview_image : "",
        show_preview: "none",
        acceptedPass : "gob",
        openDialog : false,
        socket : this.props.socket,
        hashtags : [],
        show_image_confirm : false
      }
      this.handleNickFieldChange = this.handleNickFieldChange.bind(this);
      this.handlePassFieldChange = this.handlePassFieldChange.bind(this);
    } 
    
    camCallback = (dataFromChild) => {
			this.setState({
				blobData : dataFromChild
			})
    }

    myTextChange=(event)=>{
      let textValue= event.target.value,searchText;
      let hashTaggingIndex = this.hashTaggingIndex;
      if(hashTaggingIndex && hashTaggingIndex>-1){
        if(textValue[textValue.length-1]===' ') {
            this.hashTaggingIndex = textValue.length-1; 
        } else {
          searchText = textValue.substring(hashTaggingIndex+1, textValue.length);
        }
      } else if(textValue[textValue.length-1]==='#') { 
         this.hashTaggingIndex=textValue.length-1;
      }
      this.setState({textValue,searchText});
      if(this.autocompleteRef && hashTaggingIndex && hashTaggingIndex>-1){
        this.autocompleteRef.handleChange(event);
       }
    };

    onNewRequest=(value)=>{
      let textValue = this.state.textValue;
      textValue = textValue.substring(0,this.hashTaggingIndex) + value;
      this.setState({textValue})
      document.getElementById("my_text_field").focus()
      //Try to add space
      let space_value = this.state.textValue + " "
      this.setState({textValue : space_value})
    };

    openDialog = () => {
      this.setState({
          openDialog: true
      });
    }

    closeDialog = () => {
      this.setState({
          openDialog: false 
      });
    }
    componentWillMount() { 
      //Get hashtags for autocomplete
      fetch(api_path + '/fetchhashtags', {
          method: 'GET',
          headers: {'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      })
      .then(function (res) {
          return res.json()
      })
      .then(function (json) {
          for (var i = 0; i < json.length; i++) {
            var newtag = "#" + json[i].hashtag;
            this.state.hashtags.push(newtag)
          }
        }.bind(this))
        .catch((error) => {
          console.log(error);
        });
    }

    //initiate image removal
    init_image_remove = () => {
      this.setState({
        show_image_confirm : true
      });
    }

    //Remove the added image
    remove_image = () => {
      this.setState({
          blobData : "",
          preview_image : "",
          show_preview : "none",
          show_image_confirm : false
      }) 
    }

    abort_remove_image = () => {
      this.setState({
          show_image_confirm : false
      });
    }

    handleNickFieldChange (e) {
      this.setState({
        nickValue: e.target.value
      });
    } 

    handlePassFieldChange (e) {
      this.setState({
        passValue: e.target.value
      });
    } 
      /* Post the new post xd */
    handleClick = () => {
        var data = new FormData();
				if (this.state.blobData !== null) {
					data.append('pic', this.state.blobData, 'blobby.jpg');
				}
        data.append('nick', this.state.nickValue);
        data.append('text', this.state.textValue);
        data.append('socket_id', this.state.socket.id);

        var details = {
        'nick': this.state.nickValue,
        'text': this.state.textValue,
        'socket_id' : this.state.socket.id,
        'image_src' : this.state.blobData
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        if (this.state.nickValue !== "" && this.state.textValue !== ""
        && this.state.passValue !== "awdfwajwajiowaji25925929292") {
            fetch(api_path + '/newpost', {
                method: 'post',
                body: data 
              })
              this.openDialog();
              setTimeout(this.closeDialog, 1500);
              this.setState({
                nickValue : "",
                textValue: "",
                show_preview: "none"
              })
            //Close dialog on successful post
            this.props.callback();
        } else {
          console.log("Nothing to send!");
        }
    } 
  
    render() {
        const style = {
          preview: {
            position: 'relative',
          },
          captureContainer: {
            display: 'flex',
            position: 'absolute',
            justifyContent: 'center',
            zIndex: 1,
            bottom: 0,
            width: '100%'
          },
          captureButton: {
            backgroundColor: 'red',
            borderRadius: '50%',
            height: 56,
            width: 150,
            color: '#000',
            margin: 20
          },
          captureImage: {
            width: '100%',
          }
        };
        
        const buttonStyle = {
          margin: "10px"
        }
        const buttonChildren = [
                  <RaisedButton key={1} style={buttonStyle} secondary={true} onClick={this.remove_image} > Yes </RaisedButton>,
                  <RaisedButton key={2} style={buttonStyle} primary={true} onClick={this.abort_remove_image} > No, cancel </RaisedButton>
        ]
        
        const menuStyle={
            width : "300px"
        }
        return (
        <div id="newPost" style={{ display: "block", margin: "10px", width: "100%", borderwidth: "2px", maxWidth: "800px" }}>
            <TextField fullWidth={true} value={this.state.nickValue} onChange={this.handleNickFieldChange}
                hintText="Nick"
            /><br />
            <AutoComplete
                hintText="Type anything"
                dataSource={this.state.hashtags}
                ref={ref=>this.autocompleteRef=ref}
                searchText={this.state.searchText}
                onNewRequest={this.onNewRequest}
                listStyle={{top: "180px"}}
                menuStyle={{top: "180px"}}
                textFieldStyle={{visibility:'hidden'}}
                popOverProps={{
                    canAutoPosition: true
                }}
                style={{position:'absolute',top:'100px',left:'0'}}
              />
              <TextField
                id="my_text_field"
                value={this.state.textValue|| ''}
                hintText="Write something!"
                fullWidth={true}
                multiLine={true}
                onChange={this.myTextChange}
                type="text"
              />

                <Row style={{width: "100%"}}> 
                        <img onClick={this.init_image_remove} style={{display: this.state.show_preview, width: "100%", height:"200px"}}src={this.state.preview_image} alt="N" />
                    <Col xs >
                        <RaisedButton onClick={this.handleClick} primary={true} label="GO!" fullWidth={true} />
                    </Col>
                    <Col xs >
                        <NewCamera callbackFromParent={this.camCallback}> </NewCamera>
                    </Col>
                </Row>
                <Dialog
                  title="Info"
                  modal = {true}
                  open={this.state.openDialog}
                  onRequestClose={this.closeDialog}
                >
                  Sent your gob!
                </Dialog>
                <Dialog
                  title="Do you want to remove the picture?"
                  modal = {true}
                  children={buttonChildren}
                  contentStyle={{maxWidth: "none", width: "80%"}}
                  open={this.state.show_image_confirm}
                  onRequestClose={this.closeDialog}
                >
                </Dialog>
        </div>
        )
      }
}

export default NewPost;
