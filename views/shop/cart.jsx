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
	let total = 0
	if (props.Products.length < 1) {
		content = <h1>No Products in Cart</h1>
	} else {
		content = (
			<div>
				<ul className='cart__list'>
					{props.Products.map(item => {
						total += item.quantity * item.price
						return (
							<li className='cart__item' key={item.id}>
								<span>{item.title}</span>
								<span className='item__qty'>
									Qty: {item.quantity}*{item.price}
								</span>
								<span className='item__total'>
									Subtotal: {item.quantity * item.price}
								</span>
								<form
									className='item__btn'
									action={'/delete-from-cart/' + item.id}
									method='GET'>
									<button className='btn' type='submit'>
										Delete
									</button>
								</form>
							</li>
						)
					})}
				</ul>
				<div className='order__total'>
					<span className='floatR'>Total Price: {total}</span>
				</div>
				<div className='order__btn'>
					<form className='floatR' action={'/place-order'} method='GET'>
						<button className='btn' type='submit'>
							Place Order
						</button>
					</form>
				</div>
			</div>
		)
	}
	return <div>{content}</div>
}

module.exports = wrapper(Style, Component)
