import React from "react";
import Clock from "./Clock";

export default class ReactBlock extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            number: props.someNumber,
            firstRender: new Date()
        };
    }

    render() {
        return (
            <div data-epi-property-name={this.props.propertyName} data-epi-property-render="none">
                This React component was rendered at <strong>{this.state.firstRender.toLocaleTimeString("sv-SE")}</strong> with a number of <strong>{this.props.someNumber}</strong>.<br/><br/>
                The current value of the <strong>{this.props.propertyName}</strong> property is <strong>{this.state.number}</strong>, and the current time is: <strong><Clock /></strong>
                {this.state.bonus}
            </div>
        );
    }

    componentDidMount() {

        if (document.getElementsByTagName("HTML")[0].dataset.editMode === 'True') { // We are in edit mode

            window.addEventListener('load', function () { // Ensure the 'epi' object has been initialized

                var epi = window.epi;

                epi.subscribe("beta/contentSaved", function (propertyDetails) {

                    // Check if it was "our" property that changed
                    if (this.props.propertyName.toUpperCase() === propertyDetails.properties[0].name.toUpperCase()) {
                        this.setState({ number: propertyDetails.properties[0].value }); // Update this component's state to reflect the new property value in the UI
                    }
                }.bind(this));


            }.bind(this));
        }
    }
}
