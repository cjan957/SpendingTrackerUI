import * as React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText'; 
import WithStyles from '@material-ui/core/styles/withStyles';


const ListItemHeadings = WithStyles({
    primary:{
        fontSize: "18px"
    },
    secondary:{
        fontSize: "14px",
        color: 'gray'
    }
})(ListItemText)

export default class TripList extends React.Component<{}> {

    constructor(props: any) {
        super(props);

        this.state = {
            items: []
        };

        // this.addItem = this.addItem.bind(this);
    }

    // private addItem(event: any){
    //     if()
    // }

    public render() {
        return (
           <List>
               <ListItem>
                   <ListItemHeadings primary="Australia" secondary="test"/>
               </ListItem>
               <Divider/>
               <ListItem>
               <ListItemHeadings primary="Thailand" secondary="te2st"/>
               </ListItem>
           </List>
        );
    }
}