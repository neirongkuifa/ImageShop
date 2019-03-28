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
								<span className='checkout__total'>
									Subtotal: {item.quantity * item.price}
								</span>
							</li>
						)
					})}
				</ul>
				<div className='order__total'>
					<span className='floatR'>Total Price: {total}</span>
				</div>
				<div className='order__btn'>
					<form action={'/checkout'} method='POST' className='floatR'>
						<input type='hidden' name='_csrf' value={props.csrf} />
						<input type='hidden' name='orderId' value={props.orderId} />
						<script
							src='https://checkout.stripe.com/checkout.js'
							className='stripe-button'
							data-key='pk_test_TROC3drQdG9UoO6tBwUYTPYZ00reDVYTQ6'
							data-amount={total * 100}
							data-name='Image Shop'
							data-description='Your Order Payment Info'
							data-image='https://stripe.com/img/documentation/checkout/marketplace.png'
							data-locale='auto'
							data-currency='usd'
						/>
					</form>
				</div>
			</div>
		)
	}
	return <div>{content}</div>
}

module.exports = wrapper(Style, Component)
