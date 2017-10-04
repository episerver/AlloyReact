/* This component renders a list of pages, for example News and Events.
   On-page editing is supported for block properties only, such as the NewsList
   property on the NewsPage page type. It does not support on-page editing
   for PageListBlock blocks being edited independently. */

import React from "react";

export default class ReactBlock extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};

        // Add props to component's state, to allow the component itself
        // to update its value on Episerver property updates
        for (let propertyName in props) {

            if (!props.hasOwnProperty(propertyName)) {
                continue;
            }

            this.state[propertyName] = props[propertyName];
        }
    }

    render() {

        // Create a div for each page
        var pages = this.state.pages.map(function (page, i) {
            if (i >= this.state.count) {
                return null;
            }

            return (
                <div className={'listResult ' + page.cssClass} key={'listResult-' + this.props.propertyName + '-' + i}>
                    <h3><a href={page.url}>{page.name}</a></h3>
                    {this.state.includePublishDate ? <p className="date">{page.date}</p> : null}
                    {this.state.includeIntroduction ? <p>{page.description}</p> : null}
                    <hr/>
                </div >
            );
        }.bind(this));

        // Render the heading and the page list
        return(<div><h2>{this.state.heading}</h2><hr />{pages}</div>);
    }

    componentDidMount() {

        // Check if we are in edit mode (we add an attribute to the <html> element in /Views/Shared/Layouts/_Root.cshtml)
        if (document.getElementsByTagName("HTML")[0].dataset.editMode === 'True') {

            window.addEventListener('load', function () {

                var epi = window.epi;

                // Subscribe to *all* property updates in on-page edit mode
                epi.subscribe("beta/contentSaved", function (propertyDetails) {

                    console.log('Content saved', propertyDetails);

                    // Ignore update if it wasn't successful, for example if there were validation errors
                    if (!propertyDetails.successful) {
                        return;
                    }

                    // Check if property change is for the current content
                    if (this.compareWithoutWorkId(propertyDetails.contentLink, this.props.contentLink)) {

                        // Iterate updated properties
                        for (let i = 0; i < propertyDetails.properties.length; i++) {

                            const savedProperty = propertyDetails.properties[i];

                            // Check if the updated property should be handled by this component
                            if (savedProperty.name.toUpperCase() === this.props.propertyName.toUpperCase()) {
                                this.refreshData(savedProperty);
                            }
                        }    
                    }
                }.bind(this));

            }.bind(this));
        }
    }

    /** Update the component state based on the property value, retrieving new data from the API when necessary */
    refreshData(property) {

        if (this.dataRefreshRequired(property)) {

            // Retrieve data from API (using jQuery since it's part of Alloy)
            $.getJSON('/PageListBlock/Pages?contentLink=' + this.props.contentLink + "&propertyName=" + property.name).then(function (pages) {

                // Update the component state based on the new property value and the API result 
                this.setState(Object.assign({ pages: pages }, property.value));

            }.bind(this));

        } else {
            // No API call necessary, simply update the state based on the new property value
            this.setState(property.value);
        } 
    }

    /** Determines if a property update requires the component to retrieve new data from the API. */
    dataRefreshRequired(savedProperty) {

        // Defines which properties should *not* trigger an API call
        const propertiesNotRequiringRefresh = ["includeIntroduction", "includePublishDate", "heading"];

        const value = savedProperty.value;

        // Compare the updated property value to the component state
        for (var prop in value) {
            if (this.state.hasOwnProperty(prop)) {
                if (this.state[prop] !== value[prop] && !propertiesNotRequiringRefresh.includes(prop)) {
                    switch (prop) {
                        case "count":
                            return value[prop] > this.state[prop]; // API call is only needed if the maximum number of items in the list is *increased*
                        case "categoryFilter":
                            return JSON.stringify(value[prop]) !== JSON.stringify(this.state[prop]); // API call is only needed if actual category selection has changed
                        default:
                            return true;
                    }
                }
            }
        }

        return false;
    }

    /** Compare content reference strings, ignoring any work IDs */
    compareWithoutWorkId(firstContentLink, secondContentLink) {
        return firstContentLink.split('_')[0] === secondContentLink.split('_')[0];
    }
}