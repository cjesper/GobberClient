import React, { Component } from 'react';
import Camera from 'react-camera';
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FaCamera from "react-icons/lib/fa/camera";
import axios from 'axios'

export default class OwnCamera extends Component {

  constructor(props) {
    super(props);
      this.state={
        openDialog: false,
        show_camera: "block",
        parent_post : this.props.parent_post,
        image: "",
        blob: ""
      }
    this.takePicture = this.takePicture.bind(this);
    this.openCamera = this.openCamera.bind(this);
    this.closeCamera = this.closeCamera.bind(this);
  }

    openCamera() {
        this.setState({
            openDialog : true
        });
    }

    closeCamera() {
        this.setState({
            openDialog: false
        });
    }

  takePicture() {
		console.log("Taking pic")
    try {
        this.camera.capture()
        .then(blob => {
          this.setState({
            blob: blob,
            show_camera: "none",
            image: URL.createObjectURL(blob),
            openDialog : false
          })
          this.img.src = URL.createObjectURL(blob);
          this.img.onload = () => { URL.revokeObjectURL(this.src); }
         
          this.props.callbackFromParent(blob);
          var myblob = new Blob(["This is for testing"], {type: "image/jpg"});
          var data = new FormData();
          data.append('pic', blob, 'blobby.jpg');
          }
        )
    } catch (err) {
				console.log(err)
        alert("Something is wrong with your camera!");
    }
    
  }

  render() {

    const style = {
      preview: {
        position: 'relative',
        height: "100%",
        width: "100%",
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
        height: 36,
        width: 56,
        color: '#000',
        margin: 5
      },
      captureImage: {
        position: "relative",
        zIndex:100,
        width: '100%',
        height: '80%'
      }
    };

    const actions = [
        <div>
          <div style={{display: this.state.show_camera}}>
		<FlatButton
		    label="Take pic"
		    primary={true}
		    keyboardFocused={true}
		    onClick={this.takePicture}
		/>
		<FlatButton
			label="Close Camera"
			secondary={true}
			keyboardFocused={true}
			onClick={this.closeCamera}
		/>,
            <Camera
                  style={style.preview}
                  ref={(cam) => {
                    this.camera = cam;
                  }}
                >
                </Camera>
            </div>
            <img
              alt=""
              style={style.captureImage}
              ref={(img) => {
                this.img = img;
              }}
            />
        </div>
    ];

    return (
      <div style={{width: "100%"}}>
        <RaisedButton
            label="Open Camera"
            icon={<FaCamera />}
            onClick={this.openCamera}>
        </RaisedButton>
        <Dialog
          title="Camera"
          actions={actions}
          modal = {false}
          contentStyle={{width : '100%'}}
          titleStyle={{textAlign: "center", fontFamily: "Caveat"}}
          bodyStyle={{padding:0}}
          style={{paddingTop: 0, height: '100vh', borderTop:2}}
          autoDetectWindowHeight={true}
          autoDetectBodyContent={true}
          autoScrollBodyContent={true}
          repositionOnUpdate={false}
          fullWidth="true"
          open={this.state.openDialog}
          onRequestClose={this.closeCamera}
        >
        </Dialog>
      </div>
    );
  }
}



