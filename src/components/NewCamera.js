import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FaCamera from "react-icons/lib/fa/camera";
import axios from 'axios'

export default class NewCamera extends Component {

  constructor(props) {
    super(props);
			this.fileInput = React.createRef() // ref to fileInput
      this.state={
        openDialog: false,
        show_camera: "block",
        input_image : "",
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
         
          }
        )
    } catch (err) {
        alert("Something is wrong with your camera!");
    }
  }

  chooseImage = () => {
    var self = this
    console.log("Chose image!")
    let selected_image = document.getElementById('choose_image_input').files[0];
    if (selected_image) {
			console.log(selected_image)
      var reader  = new FileReader();
      reader.onload = function(e)  {

        var image = document.createElement("img");
        image.src = e.target.result;
        self.setState({
            input_image : image.src
				})
       }
			reader.readAsDataURL(selected_image)
			self.props.callbackFromParent(selected_image)
    }
  }


	triggerInputFile = () => {
		console.log("Aff");
		if (this.fileInput.current != undefined && this.fileInput.current.click != undefined)
			this.fileInput.current.click()
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
        <div style={{height: "36px", display: "flex", alignItems: "center"}} >
					<RaisedButton primary={false} label="Take Pic!" fullWidth={true} onClick={this.triggerInputFile}> <FaCamera /> </RaisedButton>
          <input style={{opacity:"0", zIndex:-1, position: "relative", top: "15%", left: "25%"}} type="file" id="choose_image_input" onChange={this.chooseImage} ref={this.fileInput}/>
        </div>
        <div id="chosen_image_div" style={{display:"flex", alignItems:"center"}}>
          <img src={this.state.input_image} />
        </div>
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



