const React = require('react')
const wrapper = require('./includes/wrapper')

function Style(props) {
	return <></>
}
function ErrorOccured(props) {
	return (
		<div>
			<h1>Some Error Occured!</h1>
			<p>We are working on fixing it. Please retry later</p>
		</div>
	)
}

module.exports = wrapper(Style, ErrorOccured)
