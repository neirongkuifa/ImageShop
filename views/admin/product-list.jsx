const React = require('react')

const Pagination = require('../includes/pagination')
const wrapper = require('../includes/wrapper')
const deleteProduct = require('../../public/js/admin')

function Style(props) {
	return (
		<>
			<link rel='stylesheet' href='/css/product.css' />
			<script src='/js/admin.js' />
		</>
	)
}

function ProductList(props) {
	return (
		<div className='main-content'>
			{props.products.length > 0 ? (
				<div>
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
									<form
										action={'/admin/edit-product/' + item.id}
										method='GET'
										className='form'>
										<button type='submit' className='btn'>
											Edit
										</button>
									</form>
									<div
										className='form'
										dangerouslySetInnerHTML={{
											__html: `
										<button
											type='button'
											class='btn'
											onclick='deleteProduct("${props.csrf}","${item.id}", this)'>
											Delete
										</button>`
										}}
									/>
								</div>
							</article>
						))}
					</div>
					<Pagination {...props} />
				</div>
			) : (
				<h1>No Product for Now</h1>
			)}
		</div>
	)
}

module.exports = wrapper(Style, ProductList)
