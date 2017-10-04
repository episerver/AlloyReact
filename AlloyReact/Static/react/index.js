import React from "react";
import ReactDOM from "react-dom";
import ReactNumber from "./ReactNumber";
import PageListBlock from "./PageListBlock";

// Dictionary of available component types to be able to get a class from its literal name
const ComponentTypes = {
    "PageListBlock": PageListBlock,
    "ReactNumber": ReactNumber
}

document.addEventListener("DOMContentLoaded", function (event) {

    /** Mounts a React component based on container element attributes */
    function initialize(componentContainer) {

        // Pass initial state from attribute on component container element
        var props = JSON.parse(componentContainer.dataset.props || "{}");

        props.propertyName = componentContainer.dataset.epiPropertyName;

        // Render the component by resolving its class based on name
        ReactDOM.render(
            React.createElement(
                ComponentTypes[componentContainer.dataset.reactComponent], props
            ), componentContainer);
    }

    // Mount React components
    document.querySelectorAll("[data-react-component]").forEach(initialize);
});