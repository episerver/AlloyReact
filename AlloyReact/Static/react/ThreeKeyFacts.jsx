import React from "react";

export default class ThreeKeyFacts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentIndex: 0,
            facts: this.props.facts,
            bonusContent: this.props.bonusContent
        };

        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
    }

    render() {

        let bonusContentToDisplay = null;

        if (this.state.currentIndex === this.state.facts.length - 1) {
            bonusContentToDisplay = <p data-epi-property-name="BonusContent" data-epi-property-render="none" data-epi-property-edittype="floating">{this.state.bonusContent}</p>;

            console.log(`Reached fact ${this.state.currentIndex + 1}, bonus content will be displayed`, bonusContentToDisplay);
        }

        return(
            <div>
                <h2>Fact #{this.state.currentIndex + 1}</h2>
                <p data-epi-property-name={this.props.facts[this.state.currentIndex].propertyName} data-epi-property-render="none" data-epi-property-edittype="floating">{this.state.facts[this.state.currentIndex].fact}</p>
                <button onClick={this.previous} disabled={this.state.currentIndex < 1}>Previous</button> <button onClick={this.next} disabled={this.state.currentIndex >= this.props.facts.length - 1}>Next</button>
                {bonusContentToDisplay}
            </div>
        );
    }

    next() {
        this.setState({
            currentIndex: this.state.currentIndex + 1
        });
    }

    previous() {
        this.setState({
            currentIndex: this.state.currentIndex - 1
        });
    }

    componentDidMount() {

        window.addEventListener('load', function () {

            if (window.epi && window.epi.subscribe) {
                window.epi.subscribe("beta/contentSaved", function (propertyDetails) {

                    if (!propertyDetails.successful) {
                        return;
                    }

                    for (let i = 0; i < propertyDetails.properties.length; i++) {

                        const savedProperty = propertyDetails.properties[i];

                        for (let j = 0; j < this.props.facts.length; j++) {

                            // Fact updated
                            if (savedProperty.name.toUpperCase() === this.props.facts[j].propertyName.toUpperCase()) {

                                var factsCopy = this.state.facts;

                                factsCopy[j].fact = savedProperty.value;

                                this.setState({
                                    facts: factsCopy
                                });
                            }
                        }

                        // Bonus content updated
                        if (savedProperty.name === "bonusContent") {
                            this.setState({
                                bonusContent: savedProperty.value
                            });
                        }
                    }
                }.bind(this));
            }
        }.bind(this));
    }
}
