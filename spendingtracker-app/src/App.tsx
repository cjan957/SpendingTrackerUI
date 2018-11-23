import * as React from 'react';
import './newAppStyle.css';
import WelcomeBar from './WelcomeBar';
import TripList from './TripList';
import SpendingContainer from './SpendingContainer';
import Modal from 'react-responsive-modal';
import * as Webcam from "react-webcam";


interface IState {
    tripTitleSelected: any,
    budgetTripSelected: any,
    tripIDSelected: any,
    currencyTripSelected: any,
    tripList: any[],

    authenticated: boolean,
    refCamera: any,
    predictionResult: any
}

class App extends React.Component<{}, IState> {
    constructor(props: any){
        super(props)
        this.state ={
            tripTitleSelected: "Australia",
            budgetTripSelected: 1500,
            currencyTripSelected: "AU$",
            tripIDSelected: 1,
            tripList: [],

            //authentication
            authenticated: false,
            refCamera: React.createRef(),
            predictionResult: 0
   
        }
        this.authenticate = this.authenticate.bind(this);
        this.selectTrip = this.selectTrip.bind(this);
    }

    public render(){
        const {authenticated} = this.state
        return( 
            <div>
                {(!authenticated) ?
                    <Modal open={!authenticated} onClose={this.authenticate} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
                            <h3 id="authenticateMessage">Authentication</h3>
                            <Webcam
                                audio={false}
                                screenshotFormat="image/jpeg"
                                ref={this.state.refCamera}
                            />
                            <div id="loginButton" className="row nav-row">
                                <div className="btn btn-primary bottom-button" onClick={this.authenticate}>Login</div>
                            </div>
                        </Modal> 
                : ""}
                
                {(authenticated) ?
                    <div>
                        <div className="container-fluid">
                            <div className="row content">
                                <div className="col-sm-3 sidenav">
                                    <div className="welcomeBar">
                                        <WelcomeBar/>
                                    </div>
                                    <div className="tripList">
                                        <TripList selectTrip={this.selectTrip}/>
                                    </div>
                                </div>
                                <div className="col-sm-9">
                                    <div className="centered">
                                        <SpendingContainer tripTitleSelected={this.state.tripTitleSelected} 
                                            budgetTripSelected={this.state.budgetTripSelected}
                                            tripIDSelected={this.state.tripIDSelected}
                                            currencyTripSelected={this.state.currencyTripSelected} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <footer className="container-fluid">
                            <p>SpendingTracker - MSA 2018</p>

                            <iframe src="https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fspendingtrackerapp.azurewebsites.net%2F&layout=button&size=large&mobile_iframe=true&appId=134531130583735&width=73&height=28" 
                            width="73" height="28" scrolling="no" frameBorder="0" allow="encrypted-media"></iframe>
                            <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-show-count="false">Tweet</a>
                            
                        </footer>
                    </div>
                : ""}
            </div>
        )
    }  

    private selectTrip(id:any){
        if(id === "1"){
            this.setState({
                tripTitleSelected: "Australia",
                budgetTripSelected: 1500,
                currencyTripSelected: "AU$",
                tripIDSelected: 1,
                tripList: [],
            });
        }
        else if(id === "2"){
            this.setState({
                tripTitleSelected: "Thailand",
                budgetTripSelected: 20000,
                currencyTripSelected: "TH฿",
                tripIDSelected: 2,
                tripList: [],
            });
        }
    }

    private authenticate() {
        const screenshot = this.state.refCamera.current.getScreenshot();
        this.getFaceRecognitionResult(screenshot);
    }

    private getFaceRecognitionResult(image: string) {
        const url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/c6e40392-8f97-4578-ac50-eb3e2801adf0/image?iterationId=334d2b75-4cba-4623-9a59-66f86fd5670a"
        if (image === null) {
            return;
        }
        const base64 = require('base64-js');
        const base64content = image.split(";")[1].split(",")[1]
        const byteArray = base64.toByteArray(base64content);
        fetch(url, {
            body: byteArray,
            headers: {
                'cache-control': 'no-cache', 'Prediction-Key': '8adeb8b26bc64305911c6178dffd6bc4', 'Content-Type': 'application/octet-stream'
            },
            method: 'POST'
        })
            .then((response: any) => {
                if (!response.ok) {
                    // Error State
                    alert(response.statusText)
                } else {
                    response.json().then((json: any) => {
                        this.setState({ predictionResult: json.predictions[0] })
                        console.log(json.predictions[0])
                        if (this.state.predictionResult.probability > 0.65 && this.state.predictionResult.tagName === "Chanokpol") {
                            this.setState({
                                authenticated: true
                            })
                        }
                        else {
                            this.setState({
                                authenticated: false
                            })
                            console.log("not ok")
                            alert("Unauthorised!")
                        }

                    })
                }
            })
        console.log("USer is " + this.state.authenticated);
    }
}
export default App;
