const React = require('react')
const wrapper = require('../includes/wrapper')

function Style(props) {
	return <></>
}

function Component(props) {
	const item = props.product
	return (
		<div className='centered'>
			<h1>{item.title}</h1>
			<hr />
			<div>
				<img width='50%' src={item.imgUrl} alt={item.title} />
			</div>
			<h2>{item.price}</h2>
			<p>{item.description}</p>
			{props.isLoggedIn ? (
				<form action='/cart' method='POST'>
					<input type='hidden' name='productId' value={item.id} />
					<button className='btn' type='submit'>
						Add to Cart
					</button>
				</form>
			) : (
				''
			)}
		</div>
	)
}

module.exports = wrapper(Style, Component)
