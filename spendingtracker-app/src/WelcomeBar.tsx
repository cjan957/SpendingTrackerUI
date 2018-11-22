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
            <div className="container">
                <img src="/images/logo_transparent.png" className="img-rounded" alt="logo"></img>
            </div>
        );
    }

}