# On-Page Edit examples in Alloy using React

Example site for showing how to use On-Page Edit together with React. Please help out by contributing more examples through PR's!

_Note: You'll need CMS UI >=10.12.0 and while this is in Beta you [need to enable the features](https://world.episerver.com/blogs/Fredrik-Tjarnberg/Dates/2014/9/Releasing-Beta-Features/)._

## Site login
User: cmsadmin

Password: sparr0wHawk!

## Examples

### Overview
* Webpack is used for transpiling React
* React components are mounted on-demand, since we don't have a single root component
* Inside `/Static/react/index.js` there is code which mounts a React component in any HTML container element with a `data-react-component` attribute
* To simplify rendering container elements, there is an HTML helper method called `ReactComponentFor` in `/Helpers/HtmlHelpers.cs`
* The HTML helper makes sure that React scripts are added to the page, whenever at least one React component should be rendered
* The script resource is defined in `module.config`

### Rendering some number
An `int` property called _SomeNumber_ has been added to the `StandardPage` page type. It is decorated with a UI hint called _ReactNumber_.

Have a look at the display template:
`/Views/Shared/DisplayTemplates/ReactNumber.cshtml`

You'll notice the attributes used to trigger on-page editing features.

You can see it in action by on-page editing this page:
http://localhost:27399/en/about-us/news-events/press-releases/

### Editing a block-type property
The `NewsList` property of the `NewsPage` page type is now rendered by a React component, instead of the Razor view from the default Alloy templates.

Have a look at its display template:
`/Views/Shared/DisplayTemplates/PageListBlock.cshtml`

You can see it in action by on-page editing this page:
http://localhost:27399/en/alloy-plan/download-alloy-plan/

## Noteworthy files
* `/Static/react/index.js`
* `/Static/react/ReactNumber.jsx`
* `/Static/react/PageListBlock.jsx`
* `/Views/Shared/DisplayTemplates/ReactNumber.cshtml`
* `/Views/Shared/DisplayTemplates/PageListBlock.cshtml`

## Tip
The first commit ("Initial checkin") to this repo is a standard Alloy website. If you compare to the first commit, you'll be able to see what was added or changed for these examples.