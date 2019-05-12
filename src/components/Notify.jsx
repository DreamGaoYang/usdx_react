// Libraries
import React from "react";
import { inject, observer, Provider } from "mobx-react";


// @inject("transactions")
// @observer
export default class Notify extends React.Component {
    displayName = "Notify";
    key = 0;

    constructor() {
        super();
    }

    componentDidMount = () => {
        // this.props.notificator = this;
        // console.log(this.props)
    }

    // getInitialState = () => {
    //     // return {};
    // }

    render = () => {
        return (
            <Provider>
                <div style={{'background': 'red'}}>
                    <h1>nihao Notify!!!</h1>
                    <p>{this.state}</p>
                </div>
            </Provider>
            
        );
    }







};






