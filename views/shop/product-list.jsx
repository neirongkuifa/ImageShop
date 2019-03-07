const React = require('react')
const wrapper = require('../includes/wrapper')

function Style(props) {
	return (
		<>
			<link rel='stylesheet' href='/css/products.css' />
		</>
	)
}

function ProductList(props) {
	return (
		<div className='main-content'>
			{props.products.length > 0 ? (
				<div className='grid'>
					{props.products.map((item, index) => (
						<article className='card product-item' key={item.id}>
							<header className='card__header'>
								<h1 className='product__title'>{item.title}</h1>{' '}
							</header>
							<div className='card__image'>
								<img src={item.imgUrl} alt={item.title} />
							</div>
							<div className='card__content'>
								<h2 className='product__price'>${item.price}</h2>
								<p className='product__description'>{item.description}</p>
							</div>
							<div className='card__actions'>
								<form action={'/product-list/' + item.id} method='GET'>
									<button type='submit' className='btn'>
										Details
									</button>
								</form>
								<form action='/cart' method='POST'>
									<input type='hidden' name='productId' value={item.id} />
									<button type='submit' className='btn'>
										Add to Cart
									</button>
								</form>
							</div>
						</article>
					))}
				</div>
			) : (
				<h1>No Product for Now</h1>
			)}
		</div>
	)
}

module.exports = wrapper(Style, ProductList)
