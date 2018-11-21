import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';

import AirplaneIcon from '@material-ui/icons/AirplanemodeActiveSharp';


interface IProps{
    tripTitleSelected: any,
    budgetTripSelected: any,
    currencyTripSelected: any,
    tripIDSelected: any
}

interface IState{
    spendingList: any[],
    noSpendingRecord: boolean
    amountSpent: any
}

const ListItemHeadings = withStyles({
    primary:{
        fontSize: "18px"
    },
    secondary:{
        fontSize: "14px",
        color: 'gray'
    }
})(ListItemText)

export default class SpendingList extends React.Component<IProps, IState, {}> {

    constructor(props: any) {
        super(props);
        this.state = {
            noSpendingRecord: true,
            spendingList: [],
            amountSpent: 0
        }

        this.fetchCostByTrip(this.props.tripIDSelected);
        this.fetchCostByTrip = this.fetchCostByTrip.bind(this);
        this.fetchSpendingList(this.props.tripIDSelected);
        this.fetchSpendingList = this.fetchSpendingList.bind(this);
        this.actionOnList = this.actionOnList.bind(this);
        
    }

    public render() {
        return (
            <div>
                <div className="tripHeading">
                    <Typography variant="h2" gutterBottom>
                        {this.props.tripTitleSelected} Trip
                    </Typography> 
                </div>
                <div className="budgetBox">
                    <Typography variant="h4" gutterBottom>{this.props.currencyTripSelected}$ {this.state.amountSpent}</Typography><Typography variant="body1" gutterBottom>/{this.props.budgetTripSelected}</Typography>
                </div>
                <div className="spendingList">
                    <List>
                        {this.createList()}
                    </List>
                </div>
            </div> 
        );
    }

    private createList(){
        const list:any[] = []
        const spendingList = this.state.spendingList;
        if(spendingList == null){
            return list
        }
        for(let i = 0; i < spendingList.length; i++)
        {
            const children = []
            const thisItem = spendingList[i];
            children.push(
                <div key={thisItem.id}>
                    <Avatar>
                        <AirplaneIcon/>
                    </Avatar>
                    <ListItemHeadings primary={thisItem.heading} secondary={thisItem.category}/>
                </div>
            )
            list.push(<div><Divider/><ListItem onClick={this.actionOnList.bind(this,thisItem.id)}> {children} </ListItem></div>)   
        }
        return list;
        
    }

    
    private actionOnList(id: any){
        console.log("holley, you clicked a list" + id);
    }

    private fetchCostByTrip(id: any){
        let url = "https://spendingtracker.azurewebsites.net/api/Spending/costbytrip"
        if(id !== ""){
            url += "/" + id;
        }
        fetch(url, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
			if (json === undefined) {
                this.setState({
                    amountSpent: 0
                })
            }
            else{
                this.setState({
                    amountSpent: json,                    
                })
            }	
        });
    }

    private fetchSpendingList(id: any){
        let url = "https://spendingtracker.azurewebsites.net/api/Spending/spendinglistbytrip"
        if(id !== ""){
            url += "/" + id;
        }
        fetch(url, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(json => {
			let firstObject = json[0]
			if (firstObject === undefined) {
                this.setState({
                    noSpendingRecord: true
                })
            }
            else{
                this.setState({
                    spendingList: json,
                    noSpendingRecord: false
                    
                })
                //console.log(json);
            }
			
        });
    }
}