const React = require('react')
const wrapper = require('../includes/wrapper')

function Style(props) {
	return <></>
}

function Component(props) {
	return (
		<div>
			<ul>
				{Object.entries(props.Cart.products).map(item => (
					<li key={item.id}>{JSON.stringify(item)}</li>
				))}
			</ul>
		</div>
	)
}

module.exports = wrapper(Style, Component)
