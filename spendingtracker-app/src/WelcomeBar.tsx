import * as React from 'react';
import './welcomebar.css';

interface IPlaceHolder{
    modalState: boolean,
    owner: any
}

export default class WelcomeBar extends React.Component<{}, IPlaceHolder> {

    constructor(props: any){
        super(props);
        this.state = {
            modalState: false,
            owner: "Chanokpol"
        };

    }

    public render() {
        return (
            <div className="topbar">
                <h1>Hello, {this.state.owner}! </h1>
            </div>
        );
    }

}