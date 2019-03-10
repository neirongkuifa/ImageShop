const React = require('react')
const wrapper = require('../includes/wrapper')

function Style(props) {
	return (
		<>
			<link href='/css/cart.css' rel='stylesheet' />
		</>
	)
}

function Component(props) {
	let content
	if (props.Products.length < 1) {
		content = <h1>No Products in Cart</h1>
	} else {
		content = (
			<ul className='cart__list'>
				{props.Products.map(item => (
					<li className='cart__item' key={item.id}>
						<span>{item.title}</span>
						<span className='item__qty'>Qty: {item.cartItem.quantity}</span>
						<form
							className='item__btn'
							action={'/delete-from-cart/' + item.id}
							method='GET'>
							<button className='btn' type='submit'>
								Delete
							</button>
						</form>
					</li>
				))}
			</ul>
		)
	}
	return <div>{content}</div>
}

module.exports = wrapper(Style, Component)
