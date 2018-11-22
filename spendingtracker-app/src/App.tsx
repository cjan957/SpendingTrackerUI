import * as React from 'react';
import './app.css';
import WelcomeBar from './WelcomeBar';
import TripList from './TripList';
import SpendingContainer from './SpendingContainer';


interface IState {
    tripTitleSelected: any,
    budgetTripSelected: any,
    tripIDSelected: any,
    currencyTripSelected: any,
    tripList: any[],


}

class App extends React.Component<{}, IState> {
    constructor(props: any){
        super(props)
        this.state ={
            tripTitleSelected: "Australia",
            budgetTripSelected: 1500,
            currencyTripSelected: "AU",
            tripIDSelected: 1,
            tripList: [],
   
        }

    }

    public render(){
        return( 
                <div>
                    <div className="split left">
                        <div className="welcomeBar">
                            <WelcomeBar/>
                        </div>
                        <div className="tripList">
                            <TripList/>
                        </div>
                    </div>
                    <div className="split right">
                        <div className="centered">
                            <SpendingContainer tripTitleSelected={this.state.tripTitleSelected} 
                                budgetTripSelected={this.state.budgetTripSelected}
                                tripIDSelected={this.state.tripIDSelected}
                                currencyTripSelected={this.state.currencyTripSelected} />
                        </div>
                    </div>
                </div>
        )
    }  
}
export default App;
