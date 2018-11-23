import * as React from 'react';
import Modal from 'react-responsive-modal';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import DeleteIcon from '@material-ui/icons/Delete';

import AirplaneIcon from '@material-ui/icons/AirplanemodeActiveSharp';
import LocalHotelOutlined from '@material-ui/icons/LocalHotelOutlined';
import LocalPlayOutlined from '@material-ui/icons/LocalPlayOutlined';
import FastFoodOutlined from '@material-ui/icons/FastfoodOutlined';
import LocalGroceryStoreOutlined from '@material-ui/icons/LocalGroceryStoreOutlined';
import LocalTaxiOutlined from '@material-ui/icons/LocalTaxiOutlined';
import SpeakerPhoneOutlined from '@material-ui/icons/SpeakerPhoneOutlined';
import LocalMallOutlined from '@material-ui/icons/LocalMallOutlined';
import CardGiftcardOutlined from '@material-ui/icons/CardGiftcardOutlined';
import TripOriginOutlined from '@material-ui/icons/TripOriginOutlined';
import './newAppStyle.css';

// import * as Webcam from 'react-webcam';

interface IProps {
    tripTitleSelected: any,
    budgetTripSelected: any,
    currencyTripSelected: any,
    tripIDSelected: any
}

interface IState {
    spendingList: any[],
    noSpendingRecord: boolean,
    openAddItemModal: boolean,
    openEditItemModal: boolean,
    amountSpent: any,
    selectedItem: any
}

const ListItemHeadings = withStyles({
    primary: {
        fontSize: "18px"
    },
    secondary: {
        fontSize: "16px",
        color: 'gray',

    }
})(ListItemText)

export default class SpendingList extends React.Component<IProps, IState, {}> {

    constructor(props: any) {
        super(props);
        this.state = {
            noSpendingRecord: true,
            openAddItemModal: false,
            openEditItemModal: false,
            spendingList: [],
            selectedItem: [],
            amountSpent: 0
        }

        this.fetchCostByTrip = this.fetchCostByTrip.bind(this);
        this.fetchSpendingList = this.fetchSpendingList.bind(this);
        this.actionOnList = this.actionOnList.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.pushItem = this.pushItem.bind(this);
        this.GetSpecificItem = this.GetSpecificItem.bind(this);
        if (SpendingList.length !== 0) {
            this.GetSpecificItem(1); //fetch the seed data
        }
        this.UpdateItem = this.UpdateItem.bind(this);
        this.fetchAllDataOnScreen = this.fetchAllDataOnScreen.bind(this);

        this.fetchAllDataOnScreen();

    }

    componentDidUpdate(prevProps:any) {
        // Typical usage (don't forget to compare props):
        if (this.props.tripTitleSelected !== prevProps.tripTitleSelected) {
          this.fetchAllDataOnScreen();
        }
      }

    public render() {
        return (
            <div>
                <div className="tripHeading">
                    <h1 id="tripHeader">
                        {this.props.tripTitleSelected} Trip
                    </h1>
                </div>
                <div className="budgetBox">
                    <table>
                        <tr>
                            <td>
                                <h2 id="totalAmountLabel">{this.props.currencyTripSelected} {this.state.amountSpent}</h2>
                            </td>
                            <td>
                                <button type="button" className="btn btn-outline-dark" onClick={this.onOpenModal}>+ Add Item</button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div className="spendingList">
                    {(this.state.noSpendingRecord ? 
                        <div className="nothingContainer">
                            <p id="nothingLabel">No records. Press Add Item to create a new entry</p>  
                        </div>
                        : 
                        <List>
                            {this.createList()}
                        </List>   
                    )}
                   
                </div>
                <Modal open={this.state.openAddItemModal} onClose={this.onCloseModal}>
                    <form >
                        <div className="formContainer">
                            <label>Item name</label>
                            <input type="text" id="item-input" required autoFocus/>

                            <label>Currency</label>
                            <input type="text" id="currency-input-fixed" value={this.props.currencyTripSelected} readOnly />

                            <label>Price</label>
                            <input type="number" step=".01" id="price-input" placeholder="" required />

                            <label>Category</label>
                            <select id="category-input" required>
                                <option value="accomodation">Accomodation</option>
                                <option value="attractionfee">Attraction Fee</option>
                                <option value="flight">Flight</option>
                                <option value="food">Food</option>
                                <option value="grocery">Grocery</option>
                                <option value="localtransport">Local Transport</option>
                                <option value="phonedata">Phone/Data</option>
                                <option value="shopping">Shopping</option>
                                <option value="souvenir">Souvenir</option>
                                <option value="other">Other</option>
                            </select>

                            <label>Note</label>
                            <input type="text" id="note-input" />
                            <button type="button" className="btn btn-dark" onClick={this.pushItem}>Save</button>
                        </div>
                    </form>
                </Modal>


                <Modal open={this.state.openEditItemModal} onClose={this.onCloseEditModal}>
                    <p id="requiredField" hidden>Edit</p>
                    <form>
                        <div className="formContainer">
                            <label>Item name</label> 
                            <input type="text" placeholder={this.state.selectedItem.heading} id="item-input-edit" required disabled />

                            <label>Currency</label>
                            <input type="text" value={this.state.selectedItem.currency} id="currency-input-edit" readOnly disabled />

                            <label>Price</label>
                            <input type="number" placeholder={this.state.selectedItem.cost} step=".01" id="price-input-edit" disabled required />

                            <label>Category</label>
                            <select id="category-input-edit" value={this.state.selectedItem.category} required disabled>
                                <option value="accomodation">Accomodation</option>
                                <option value="attractionfee">Attraction Fee</option>
                                <option value="flight">Flight</option>
                                <option value="food">Food</option>
                                <option value="grocery">Grocery</option>
                                <option value="localtransport">Local Transport</option>
                                <option value="phonedata">Phone/Data</option>
                                <option value="shopping">Shopping</option>
                                <option value="souvenir">Souvenir</option>
                                <option value="other">Other</option>
                            </select>

                            <label>Note</label>
                            <input type="text" placeholder={this.state.selectedItem.note} id="note-input-edit" disabled />
                            <table>
                                <tr>
                                    <td><button type="button" className="btn btn-secondary"onClick={this.enableEditing}>Edit</button></td>
                                    <td><button type="button" className="btn btn-dark" id="edit_save_button" onClick={this.UpdateItem}>Save</button></td>
                                </tr>
                            </table>
                        </div>
                    </form>
                </Modal>
            </div>
        );
    }

    private async pushItem() {

        let url = "https://spendingtracker.azurewebsites.net/api/Spending"
        console.log("inPushItem")
        const itemTitle = document.getElementById("item-input") as HTMLInputElement //required
        const currency = document.getElementById("currency-input-fixed") as HTMLInputElement //required
        const price = document.getElementById("price-input") as HTMLInputElement //required
        const category = document.getElementById("category-input") as HTMLInputElement //required
        const note = document.getElementById("note-input") as HTMLInputElement

        //itemTitle & price & category must not be empty
        if (itemTitle.value === "" || price.value === "" || category.value === "") {
            alert("Please fill in all the fields!")
            return;
        }

        const tripID_v = this.props.tripIDSelected;
        const category_v = category.value;
        const heading_v = itemTitle.value;
        const cost_v = price.value;
        const currency_v = currency.value;
        const note_v = note.value !== "" ? note.value : "";

        fetch(url, {
            body: JSON.stringify({
                "tripID": tripID_v,
                "category": category_v,
                "heading": heading_v,
                "cost": cost_v,
                "currency": currency_v,
                "note": note_v
            }),
            headers: { 'cache-control': 'no-cache', 'Content-Type': 'application/json' },
            method: 'POST'
        })
            .then((response: any) => {
                if (!response.ok) {
                    alert(response.statusText)
                } else {
                    this.fetchAllDataOnScreen();
                    this.onCloseModal();
                }
            })

    }

    private deleteItem(id: any) {

        let url = "https://spendingtracker.azurewebsites.net/api/Spending/" + id

        fetch(url, {
            method: 'DELETE'
        })
            .then((response: any) => {
                if (!response.ok) {
                    // Error Response
                    alert(response.statusText)
                }
                else {
                    this.fetchAllDataOnScreen();
                    this.onCloseEditModal();
                }
            })


    }

    private fetchCostByTrip(id: any) {
        let url = "https://spendingtracker.azurewebsites.net/api/Spending/costbytrip"
        if (id !== "") {
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
                else {
                    this.setState({
                        amountSpent: json,
                    })
                }
            });
    }

    private fetchSpendingList(id: any) {
        let url = "https://spendingtracker.azurewebsites.net/api/Spending/spendinglistbytrip"
        if (id !== "") {
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
                        noSpendingRecord: true,
                        spendingList: []
                    })
                }
                else {
                    this.setState({
                        spendingList: json,
                        noSpendingRecord: false

                    })
                    //console.log(json);
                }

            });
    }

    private GetSpecificItem(id: any) {
        let url = "https://spendingtracker.azurewebsites.net/api/Spending"
        if (id !== "") {
            url += "/" + id;
        }
        fetch(url, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(json => {
                if (json === undefined || json === []) {
                    alert("Errm.. something went wrong, please try again later")
                    this.setState({
                        selectedItem: []
                    })
                }
                else {
                    this.setState({
                        selectedItem: json,
                    })
                    //console.log(json);
                }

            });
    }

    private UpdateItem() {

        const itemTitle = document.getElementById("item-input-edit") as HTMLInputElement //required
        const currency = document.getElementById("currency-input-edit") as HTMLInputElement //required
        const price = document.getElementById("price-input-edit") as HTMLInputElement //required
        const category = document.getElementById("category-input-edit") as HTMLInputElement //required
        const note = document.getElementById("note-input-edit") as HTMLInputElement

        //itemTitle & price & category must not be empty
        if (itemTitle.value === "" || price.value === "" || category.value === "") {
            alert("It doesn't seem like you changed anything! (Click Edit and) fill in all the boxes!")
            return;
        }

        const ID_V = this.state.selectedItem.id;
        const tripID_v = this.props.tripIDSelected;
        const category_v = category.value;
        const heading_v = itemTitle.value;
        const cost_v = price.value;
        const currency_v = currency.value;
        const note_v = note.value !== "" ? note.value : "";

        let url = "https://spendingtracker.azurewebsites.net/api/Spending/" + ID_V;

        fetch(url, {
            body: JSON.stringify({
                "id": ID_V,
                "tripID": tripID_v,
                "category": category_v,
                "heading": heading_v,
                "cost": cost_v,
                "currency": currency_v,
                "note": note_v
            }),
            headers: { 'cache-control': 'no-cache', 'Content-Type': 'application/json' },
            method: 'PUT'
        })
            .then((response: any) => {
                if (!response.ok) {
                    alert(response.statusText)
                } else {
                    this.fetchAllDataOnScreen();
                    this.onCloseEditModal();
                }
            })
    }

     private createList() {
        const list: any[] = []
        const spendingList = this.state.spendingList;
        if (spendingList == null) {
            return list
        }
        for (let i = 0; i < spendingList.length; i++) {
            const children = []
            const thisItem = spendingList[i];
            children.push(
                <div>
                    <Avatar  >
                        {this.labelDetermine(thisItem.category)}
                    </Avatar>
                    <ListItemHeadings primary={thisItem.heading} secondary={thisItem.category + " " + this.props.currencyTripSelected + " " + thisItem.cost} />
                    <ListItemSecondaryAction>
                        <IconButton aria-label="Delete" onClick={this.deleteItem.bind(this, thisItem.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </div>
            )
            list.push(<div><ListItem onClick={this.actionOnList.bind(this, thisItem.id)}> {children} </ListItem><Divider /></div>)
        }
        return list.reverse();
    }

    private labelDetermine(category: any) {
        const children = []
        switch (category) {
            case "accomodation": {
                children.push(<LocalHotelOutlined />) //local_hotel
                return children;
            }
            case "attractionfee": {
                children.push(<LocalPlayOutlined />) //local_play
                return children;
            }
            case "flight": {
                children.push(<AirplaneIcon />) //airplane icon
                return children;
            }
            case "food": {
                children.push(< FastFoodOutlined/>) //fastfood
                return children;
            }
            case "grocery": {
                children.push(<LocalGroceryStoreOutlined />) // local_grocery
                return children;
            }
            case "localtransport": {
                children.push(<LocalTaxiOutlined />) //local_taxi
                return children;
            }
            case "phonedata": {
                children.push(<SpeakerPhoneOutlined />) // Speaker_Phone
                return children;
            }
            case "shopping": {
                children.push(<LocalMallOutlined />) // local mall
                return children;
            }
            case "souvenir": {
                children.push(<CardGiftcardOutlined />) // card_giftcard
                return children;
            }
            case "other": {
                children.push(<TripOriginOutlined />) // card_giftcard
                return children;
            }
            default: {
                children.push(<TripOriginOutlined />) //trip_origin
                return children;
                break;

            }
        }
    }

    private enableEditing() {

        var edit_save_button = document.getElementById("edit_save_button") as HTMLInputElement //required
        const itemTitle = document.getElementById("item-input-edit") as HTMLInputElement //required
        const currency = document.getElementById("currency-input-edit") as HTMLInputElement //required
        const price = document.getElementById("price-input-edit") as HTMLInputElement //required
        const note = document.getElementById("note-input-edit") as HTMLInputElement
        
        var required_class = document.getElementById("requiredField") as HTMLInputElement
        required_class.hidden = false;

        edit_save_button.disabled = false;
        itemTitle.disabled = false;
        currency.disabled = false;
        price.disabled = false;
        note.disabled = false;
    }

    private actionOnList(id: any) {
        this.GetSpecificItem(id);
        if (this.state.selectedItem !== []) {
            this.setState({ openEditItemModal: true });
        }
    }

    private onCloseEditModal = () => {
        this.setState({ openEditItemModal: false });
    };

    private onCloseModal = () => {
        this.setState({ openAddItemModal: false });
    };

    private onOpenModal = () => {
        this.setState({ openAddItemModal: true });
    };

    private fetchAllDataOnScreen(){
        console.log("fetching...")
        this.fetchCostByTrip(this.props.tripIDSelected);
        this.fetchSpendingList(this.props.tripIDSelected)
    }
}