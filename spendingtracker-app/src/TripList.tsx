import * as React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText'; 
import WithStyles from '@material-ui/core/styles/withStyles';

interface IProp{
    selectTrip: any
}

const ListItemHeadings = WithStyles({
    primary:{
        fontSize: "18px"
    },
    secondary:{
        fontSize: "14px",
        color: 'gray'
    }
})(ListItemText)

export default class TripList extends React.Component<IProp, {}> {

    constructor(props: any) {
        super(props);

        this.state = {
            items: []
        };

        this.chooseFromListOne = this.chooseFromListOne.bind(this);
        this.chooseFromListTwo = this.chooseFromListTwo.bind(this);

    }


    // private addItem(event: any){
    //     if()
    // }

    public render() {
        return (
            <div>
                <List>
                    <ListItem>
                        <ListItemHeadings primary="Australia" onClick={this.chooseFromListOne} secondary="15 November 2018 - 19 November 2018 "/>
                    </ListItem>
                    <Divider/>
                    <ListItem>
                        <ListItemHeadings primary="Thailand" onClick={this.chooseFromListTwo} secondary="6 July 2018 - 22 July 2018"/>
                    </ListItem>
                </List>
            </div>
            
        );
    }

    private chooseFromListOne(){
        this.props.selectTrip("1")  
    }

    private chooseFromListTwo(){
        this.props.selectTrip("2")  
    }


}