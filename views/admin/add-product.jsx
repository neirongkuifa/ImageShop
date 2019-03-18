const React = require('react')
const wrapper = require('../includes/wrapper')

function Style(props) {
	return (
		<>
			<link rel='stylesheet' href='/css/product.css' />
			<link rel='stylesheet' href='/css/forms.css' />
			<link
				href='https://fonts.googleapis.com/css?family=Ubuntu+Condensed'
				rel='stylesheet'
			/>
		</>
	)
}

function AddProduct(props) {
	return (
		<form className='product-form' action='/admin/add-product' method='POST'>
			<input type='hidden' name='_csrf' value={props.csrf} />
			<div className='form-control'>
				<label>Title: </label>
				<input type='text' placeholder='Enter Product ' name='title' />
			</div>
			<div className='form-control'>
				<label>Image: </label>
				<input type='text' placeholder='Enter Image Url ' name='imgUrl' />
			</div>
			<div className='form-control'>
				<label>Price: </label>
				<input type='number' name='price' step='0.01' />
			</div>
			<div className='form-control'>
				<label>Description: </label>
				<textarea name='description' rows='5' />
			</div>
			<button className='btn'>Add Product</button>
		</form>
	)
}

module.exports = wrapper(Style, AddProduct)
