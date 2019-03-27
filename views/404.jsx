const React = require('react')
const wrapper = require('./includes/wrapper')

function Style(props) {
	return <></>
}
function PageNotFound(props) {
	return <h1>Page Not Found</h1>
}

module.exports = wrapper(Style, PageNotFound)
