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
	if (props.Cart.length < 1) {
		content = <h1>No Products in Cart</h1>
	} else {
		content = (
			<ul className='cart__list'>
				{props.Cart.map(item => (
					<li className='cart__item' key={item.product.id}>
						<span>{item.product.title}</span>
						<span className='item__qty'>Qty: {item.qty}</span>
						<form
							className='item__btn'
							action={'/delete-from-cart/' + item.product.id}
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
