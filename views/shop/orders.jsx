const React = require('react')
const wrapper = require('../includes/wrapper')

function Style(props) {
	return <></>
}

function Component(props) {
	let content
	if (props.orders.length < 1) {
		content = <h1>No Orders For Now</h1>
	} else {
		content = (
			<ul className='order__list'>
				{props.orders.map(order => {
					return (
						<li key={order.id} className='order__item'>
							<span>{order.id}</span>
							<span>
								Order Total:
								{order.items.reduce(
									(acc, product) => acc + product.quantity * product.price,
									0
								)}
							</span>
							<form
								className='order__form'
								action={
									(order.paymentStatus ? '/Details/' : '/Checkout/') + order.id
								}>
								<button className='btn'>
									{order.paymentStatus ? 'Details' : 'Checkout'}
								</button>
							</form>
						</li>
					)
				})}
			</ul>
		)
	}
	return <div>{content}</div>
}

module.exports = wrapper(Style, Component)
