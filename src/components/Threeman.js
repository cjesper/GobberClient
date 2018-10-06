import React from 'react';
import {Row, Col} from 'react-flexbox-grid';
import Dialog from 'material-ui/Dialog';

class Threeman extends React.Component {
     constructor(props) {
      super(props);
       this.state = {
           firstValue : 0,
           secondValue : 0,
           firstDice : ["none", "none", "none", "none", "none", "none"],
           secondDice : ["none", "none", "none", "none", "none", "none"],
           firstDice_color : "white",
           streak : 0,
           secondDice_color: "white",
           showDialog : false,
           infoText : "Loading..."
        }
        
         this.randomize= this.randomize.bind(this);
         this.randomize_first = this.randomize_first.bind(this);
         this.randomize_second = this.randomize_second.bind(this);
         this.convertDice = this.convertDice.bind(this);
      }

    randomize () {
        this.randomize_first();
        this.randomize_second();
        this.setState({
            showDialog : true
        });

        var count = 0;
        setTimeout(() => {
            console.log(this.state);
            var firstVal = this.state.firstValue;
            var secondVal = this.state.secondValue;
            var sum = firstVal + secondVal;
            var text = ""
            var innercount = 0;
            if (!(sum % 3 === 0 || firstVal === 3 || secondVal === 3)) {
                console.log("Reset streak :( "); 
                this.setState({
                    streak: 0
                });
            }
            if (sum % 3 === 0 || firstVal === 3 || secondVal === 3) {
                text = "FOCKIN THREEMAN INNIT \n"
                var currStreak = this.state.streak;
                var newStreak = currStreak + 1; 
                this.setState({
                    streak : newStreak
                })
                if (this.state.streak >= 3) {
                    text = text + "HOT STREAK! Threeman drinking for the " + this.state.streak + "th time \n"
                }
            }
            if (firstVal === secondVal) {
                text = text + " HAND OUT THOSE " + sum + " KLUNKZ \n"
                if (sum === 12) {
                    text = "BRING. THE. HAMMER. DOWN. \n"
                }
            }
            if (sum === 10) {
                text = text + "ALL DRINK"
            }
            if (sum === 7) {
                text = text + "ZEVEN AHEAD"
            }
            if (sum % 6 === 0) {
                text = text + " The sexmasters ;) Drink "
            }
            if (sum === 9) {
                text = text + " NINE BEHIND";
            }
            this.setState({ infoText : text});
        } ,100);
        
        setTimeout(() => {
            this.setState({ showDialog : true});
        }, 100);
        
        setTimeout(() => {
            this.setState({ showDialog: false});
        } , 3000);
    }
    randomize_first() {
        var values = Math.floor((Math.random() * 6) + 1);
        this.convertDice("firstDice", values);
        
        this.setState({
            firstValue : values,
            firstDice_color : "#f45642"
        })
        setTimeout(() => {
            this.setState({ firstDice_color: "white"});
        } ,1000);

    } 
    
    randomize_second() {
        var values = Math.floor((Math.random() * 6) + 1);
        
        this.convertDice("secondDice", values);
        
        this.setState({
            secondDice_color : "#f45642",
            secondValue : values
        })
        setTimeout(() => {
            this.setState({ secondDice_color: "white"});
        } ,1000);

    } 

    convertDice (dice, value) {
            var resultingArray = ["none", "none", "none", "none", "none", "none"];
            for (var i = 0; i < value; i++) {
                resultingArray[i] = "block"; 
            }
            if (dice === "firstDice") {
                this.setState({
                    firstDice : resultingArray
                })
            } else {
                this.setState({
                    secondDice : resultingArray
                })
            }
        } 

    render() {
        var divStyle = {
            width: "100%",
            margin : "2px",
            fontFamily: 'Caveat',
            fontSize: "32",
        }
        return (
            <div style={divStyle}>
            <Row onClick={this.randomize} style={{marginTop: "1px"}}>
                <Col style={{ backgroundColor: this.state.firstDice_color, textAlign: "center", height: "130px", maxWidth: "30%", marginLeft: "30px", border: "1px solid black", borderRadius: "5%"}} xs={6} > 
                    <Row style={{textAlign: "center"}}>
                        <Col style={{marginLeft: "5px"}} xs={3} > 
                            <div style={{display: this.state.firstDice[0], borderRadius: "50%", marginTop: "5px", marginLeft: "10%", textAlign: "center", width: "25px", height: "25px", backgroundColor: "black"}}> </div> 
                        </Col>
                        <Col style={{marginLeft: "35px"}} xs={3}> 
                            <div style={{display: this.state.firstDice[1], borderRadius: "50%", marginTop: "5px", marginLeft: "-20%", textAlign: "center", width: "25px", height: "25px", backgroundColor: "black"}}> </div> 
                        </Col>
                    </Row>
                    <Row style={{textAlign: "center"}}>
                        <Col style={{marginLeft: "5px"}} xs={3} > 
                            <div style={{display: this.state.firstDice[2], borderRadius: "50%", marginTop: "13px", marginLeft: "10%", textAlign: "center", width: "25px", height: "25px", backgroundColor: "black"}}> </div> 
                        </Col>
                        <Col style={{marginLeft: "35px"}} xs={3}> 
                            <div style={{display: this.state.firstDice[3], borderRadius: "50%", marginTop: "13px", marginLeft: "-20%", textAlign: "center", width: "25px", height: "25px", backgroundColor: "black"}}> </div> 
                        </Col>
                    </Row>
                    <Row style={{textAlign: "center"}}>
                        <Col style={{marginLeft: "5px"}} xs={3} > 
                            <div style={{display: this.state.firstDice[4], borderRadius: "50%", marginTop: "13px", marginLeft: "10%", textAlign: "center", width: "25px", height: "25px", backgroundColor: "black"}}> </div> 
                        </Col>
                        <Col style={{marginLeft: "35px", marginBottom: "0px"}} xs={3}> 
                            <div style={{display: this.state.firstDice[5], borderRadius: "50%", marginTop: "13px", marginLeft: "-20%", textAlign: "center", width: "25px", height: "25px", backgroundColor: "black"}}> </div> 
                        </Col>
                    </Row>
                </Col>
                    <Col style={{backgroundColor : this.state.secondDice_color, textAlign: "center",maxHeight: "130px", maxWidth: "30%", marginLeft: "80px", border: "1px solid black", borderRadius: "5%"}} xs={6}> 
                     <Row style={{textAlign: "center"}}>
                        <Col style={{marginLeft: "5px"}} xs={3} > 
                            <div style={{display: this.state.secondDice[0], borderRadius: "50%", marginTop: "5px", marginLeft: "10%", textAlign: "center", width: "25px", height: "25px", backgroundColor: "black"}}> </div> 
                        </Col>
                        <Col style={{marginLeft: "35px"}} xs={3}> 
                            <div style={{display: this.state.secondDice[1], borderRadius: "50%", marginTop: "5px", marginLeft: "-20%", textAlign: "center", width: "25px", height: "25px", backgroundColor: "black"}}> </div> 
                        </Col>
                    </Row>
                    <Row style={{textAlign: "center"}}>
                        <Col style={{marginLeft: "5px"}} xs={3} > 
                            <div style={{display: this.state.secondDice[2], borderRadius: "50%", marginTop: "13px", marginLeft: "10%", textAlign: "center", width: "25px", height: "25px", backgroundColor: "black"}}> </div> 
                        </Col>
                        <Col style={{marginLeft: "35px"}} xs={3}> 
                            <div style={{display: this.state.secondDice[3], borderRadius: "50%", marginTop: "13px", marginLeft: "-20%", textAlign: "center", width: "25px", height: "25px", backgroundColor: "black"}}> </div> 
                        </Col>
                    </Row>
                    <Row style={{textAlign: "center"}}>
                        <Col style={{marginLeft: "5px"}} xs={3} > 
                            <div style={{display: this.state.secondDice[4], borderRadius: "50%", marginTop: "13px", marginLeft: "10%", textAlign: "center", width: "25px", height: "25px", backgroundColor: "black"}}> </div> 
                        </Col>
                        <Col style={{marginLeft: "35px", marginBottom: "0px"}} xs={3}> 
                            <div style={{display: this.state.secondDice[5], borderRadius: "50%", marginTop: "13px", marginLeft: "-20%", textAlign: "center", width: "25px", height: "25px", backgroundColor: "black"}}> </div> 
                        </Col>
                    </Row>
                    </Col>
              </Row>
                <Dialog
                  style={{marginTop: "150px"}}
                  title="DDDJF"
                  modal = {true}
                  open={this.state.showDialog}
                  onRequestClose={this.closeDialog}
                > {this.state.infoText}
                </Dialog>
           </div>
        )
    }
}

export default Threeman;
