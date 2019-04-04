import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Threeman from './Threeman.js';
import Spotify from 'spotify-web-api-js'
var spotifyApi = new Spotify();

export default class WelcomeBar extends React.Component {

  constructor(props) {
      super(props)
        this.state = {
            open: false,
            show_threeman : false,
            openDialog : false,
            recommended_g : "",
            g_color : "grey",
            show_power_hour : false,
            desired_song: "",
            playLists: []
        }
        this.generate_g = this.generate_g.bind(this);
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    }  
    
    handleTextFieldChange (e) {
      this.setState({
        desired_song: e.target.value
      });
    }
    
    generate_g () {
        var groggs = ["Tolva", "Flat Tire", "Arg Tomte", "Screwdriver", "DG", "Illusion",
                    "Whiskey", "Prippan", "Special", "MILLENIUM!!!!!", "Slots <3"]

        var seed = Math.floor((Math.random()*20)+1);
        console.log(seed);
        for (var i = 0; i < seed; i++) {
            setTimeout(() => {
                var rand = Math.floor((Math.random()*groggs.length-1) + 1);
                console.log(groggs[rand]); 
                this.setState({
                    recommended_g: groggs[rand]
                })
                }, (i*1000 - i*100))
        }
    }

    //Toggle function (open/close Drawer)
    toggleDrawer() {
        this.setState({
            open: false
        })
    }
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

    openThreeman = () => {
        this.setState({
            show_threeman : true
        });
    }
    
    closeThreeman = () => {
        this.setState({
            show_threeman : false 
        });
    }

    openPowerHour = () => {
        this.setState({
            show_power_hour: true 
        });
    }
    
    closePowerHour = () => {
        this.setState({
            show_power_hour: false 
        });
    }
    
    //Spotify-stuff
    authorize = () => {
      fetch('/authorize', {
          method: 'GET',
          headers: {'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'},
      })
      .then(function (res) {
          return res.json(); 
      }).then(function (json) {
          var token = json.token;
          console.log(token);
          spotifyApi.setAccessToken(token);
      })
    }

    getSong = () => {
      var desired = this.state.desired_song;
      console.log(desired);
      spotifyApi.searchPlaylists(desired)
          .then(function(data) {
            this.setState({
              playLists : data
            })
            console.log(this.state.playLists);
          }.bind(this), function(err) {
            console.error(err);
          });
    }

    render() {
        var appBarStyle = {
            width: "100%",
            fontFamily: 'Caveat',
            fontSize: "24",
            paddingLeft: "20%",
            height: "45px",
            paddingTop: "0%"
        }
        var threemanStyle = {
            fontFamily : "Comic Sans MS",
            textAlign: "center",
            padding: 2,
            backgroundColor: "gradient(red, blue, yellow)",
            overflow: 'hidden'
        }
        return (
            <div>
                <AppBar
                    title="Gobber"
                    titleStyle={appBarStyle}
                    style={{backgroundColor: "green"}}
                    onLeftIconButtonClick={this.toggleDrawer.bind(this)} 
                />
                <Drawer 
                    open={this.state.open}
                    docked={false}
                    onRequestChange={this.toggleDrawer.bind(this)}
                    onToggleDrawer={this.toggleDrawer.bind(this)} 
                    width="35%" >
                        <MenuItem onClick={this.openDialog} primaryText="G."> </MenuItem>
                        <MenuItem onClick={this.openThreeman} primaryText="Threeman!"> </MenuItem>
                        <MenuItem style={{display: "none"}} onClick={this.openPowerHour} primaryText="Power Hour"> </MenuItem>
                </Drawer>
                <Dialog open={this.state.openDialog} title="Drink 'suggester'"> 
                    <div>
                        <RaisedButton onClick={this.generate_g} label="Generate a G!"> </RaisedButton>
                        <h2 style={{color: this.state.g_color , textAlign: "center"}}>{this.state.recommended_g}</h2>
                        <RaisedButton onClick={this.closeDialog} label="Okay i will now häv :) ">  </RaisedButton>
                    </div>
                </Dialog>
                <Dialog
                  modal={false}
                  contentStyle={{width : '100%', transform: 'translate(0,0)'}}
                  autoDetectWindowHeigh={true}
                  autoDetectBodyContent={true}
                  autoScrollBodyContent={true}
                  repositionOnUpdate={true}
                  bodyStyle={threemanStyle}
                  titleStyle={threemanStyle}
                  fullWidth="true"
                  onRequestClose={this.closeThreeman}
                    open={this.state.show_threeman} 
                    title="THREEMAN"> 
                    <div>
                        <Threeman style={{display: this.state.show_threeman}}> </Threeman>
                        <RaisedButton onClick={this.closeThreeman} label="Done">  </RaisedButton>
                    </div>
                </Dialog>
                <Dialog open={this.state.show_power_hour} title="Power Hour"> 
                    <div>
                        <TextField value={this.state.desired_song} onChange={this.handleTextFieldChange}
                        hintText="Write something, eg G or J."
                        multiLine={true}
                        /><br />
                        <RaisedButton onClick={this.getSong} style={{backgroundColor: "red"}} label="Get song!" > </RaisedButton>
                        <RaisedButton onClick={this.authorize} label="Auth" > </RaisedButton>
                        <RaisedButton onClick={this.closePowerHour} label="Close" > </RaisedButton>
                    </div>
                </Dialog>
           </div>
        )
    }
}
