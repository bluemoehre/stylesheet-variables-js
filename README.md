# Stylesheet Variables Demo
This is a small demo to show a CSS theming approach using [Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) (with simple polyfill included for older browsers).\
That way whitelabel UIs are much simpler to handle, since you will specify a colorset CSS file,
which contains your new CSS variables/props only, instead of rendering full stylesheets.

[Demo](https://bluemoehre.de/code/stylesheet-variables-js/)\
(Use your debugging tools to see what is going on =)

## Usage

To install all required packages locally\
`npm install`

To start a local dev server\
`npm start`

## TODOs
- app must run as singleton
- remove obsolete rules and style tags when applying new ones
- skip third party stylesheets
- handle new injected stylesheets