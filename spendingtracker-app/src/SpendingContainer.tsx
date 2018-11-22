import * as React from 'react';
import Modal from 'react-responsive-modal';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import DeleteIcon from '@material-ui/icons/Delete';
import AirplaneIcon from '@material-ui/icons/AirplanemodeActiveSharp';
// import * as Webcam from 'react-webcam';
import './app.css';


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

    authenticated: boolean,
    refCamera: any,
    predictionResult: any
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
            amountSpent: 0,

            //authentication
            authenticated: false,
            refCamera: React.createRef(),
            predictionResult: 0
        }

        this.fetchCostByTrip(this.props.tripIDSelected);
        this.fetchCostByTrip = this.fetchCostByTrip.bind(this);

        this.fetchSpendingList(this.props.tripIDSelected);
        this.fetchSpendingList = this.fetchSpendingList.bind(this);

        this.actionOnList = this.actionOnList.bind(this);

        this.deleteItem = this.deleteItem.bind(this);

        this.pushItem = this.pushItem.bind(this);

        this.GetSpecificItem = this.GetSpecificItem.bind(this);
        if (SpendingList.length !== 0) {
            this.GetSpecificItem(1); //fetch the seed data
        }
        this.UpdateItem = this.UpdateItem.bind(this);
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
                    <button type="button" onClick={this.onOpenModal}>Add an item!</button>
                </div>
                <div className="spendingList">
                    <List>
                        {this.createList()}
                    </List>
                </div>
                <Modal open={this.state.openAddItemModal} onClose={this.onCloseModal}>
                    <form >
                        <div className="formContainer">
                            <label>Item name</label>
                            <input type="text" id="item-input" required />

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
                            </select>

                            <label>Note</label>
                            <input type="text" id="note-input" />
                            <button type="button" onClick={this.pushItem}>Save</button>
                        </div>
                    </form>
                </Modal>


                <Modal open={this.state.openEditItemModal} onClose={this.onCloseEditModal}>
                    <p id="requiredField" hidden>Please enter all the fields again and then click Save. Currency and Category are locked and cannot be changed</p>
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
                            </select>

                            <label>Note</label>
                            <input type="text" placeholder={this.state.selectedItem.note} id="note-input-edit" disabled />
                            <button type="button" onClick={this.enableEditing}>Edit</button>
                            <button type="button" id="edit_save_button" onClick={this.UpdateItem}>Save</button>
                        </div>
                    </form>
                </Modal>
            </div>
        );
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

    // Modal close
    private onCloseModal = () => {
        this.setState({ openAddItemModal: false });
    };

    private onOpenModal = () => {
        this.setState({ openAddItemModal: true });
    };

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
                    <ListItemAvatar >
                        <Avatar onClick={this.actionOnList.bind(this, thisItem.id)} >
                            {this.labelDetermine(thisItem.category)}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemHeadings primary={thisItem.heading} secondary={thisItem.category + " " + this.props.currencyTripSelected + "$ " + thisItem.cost} />

                    <ListItemSecondaryAction>
                        <IconButton aria-label="Delete" onClick={this.deleteItem.bind(this, thisItem.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </div>
            )
            list.push(<div><ListItem> {children} </ListItem><Divider /></div>)
        }
        return list;

    }

    private labelDetermine(category: any) {
        const children = []
        switch (category) {
            case "accomodation": {
                children.push(<div><AirplaneIcon /></div>)
                return children;
            }
            case "attractionfee": {
                children.push(<div><AirplaneIcon /></div>)
                return children;
            }
            case "flight": {
                children.push(<div><AirplaneIcon /></div>)
                return children;
            }
            case "food": {
                children.push(<div><AirplaneIcon /></div>)
                return children;
            }
            case "grocery": {
                children.push(<div><AirplaneIcon /></div>)
                return children;
            }
            case "localtransport": {
                children.push(<div><AirplaneIcon /></div>)
                return children;
            }
            case "phonedata": {
                children.push(<div><AirplaneIcon /></div>)
                return children;
            }
            case "shopping": {
                children.push(<div><AirplaneIcon /></div>)
                return children;
            }
            case "souvenir": {
                children.push(<div><AirplaneIcon /></div>)
                return children;
            }
            default: {
                children.push(<div></div>)
                return children;
                break;

            }
        }
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

    // private authenticate() {
    //     const screenshot = this.state.refCamera.current.getScreenshot();
    //     this.getFaceRecognitionResult(screenshot);
    // }

    // Call custom vision model

    // private getFaceRecognitionResult(image: string) {
    //     const url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/c6e40392-8f97-4578-ac50-eb3e2801adf0/image?iterationId=334d2b75-4cba-4623-9a59-66f86fd5670a"
    //     if (image === null) {
    //         return;
    //     }
    //     const base64 = require('base64-js');
    //     const base64content = image.split(";")[1].split(",")[1]
    //     const byteArray = base64.toByteArray(base64content);
    //     fetch(url, {
    //         body: byteArray,
    //         headers: {
    //             'cache-control': 'no-cache', 'Prediction-Key': '8adeb8b26bc64305911c6178dffd6bc4', 'Content-Type': 'application/octet-stream'
    //         },
    //         method: 'POST'
    //     })
    //         .then((response: any) => {
    //             if (!response.ok) {
    //                 // Error State
    //                 alert(response.statusText)
    //             } else {
    //                 response.json().then((json: any) => {
    //                     this.setState({ predictionResult: json.predictions[0] })
    //                     console.log(json.predictions[0])
    //                     if (this.state.predictionResult.probability > 0.65 && this.state.predictionResult.tagName === "Chanokpol") {
    //                         this.setState({
    //                             authenticated: true
    //                         })
    //                         alert("Authenticated!, try deleting the entry again")
    //                     }
    //                     else {
    //                         this.setState({
    //                             authenticated: false
    //                         })
    //                         console.log("not ok")
    //                         alert("Unrecognised face!")
    //                     }

    //                 })
    //             }
    //         })
    //     console.log("USer is " + this.state.authenticated);
    // }

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
                    location.reload()
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
                    location.reload()
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
                        noSpendingRecord: true
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
        console.log("inUpdateItem")
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
                    alert("Item updated successfully")
                    location.reload()
                }
            })

    }
}