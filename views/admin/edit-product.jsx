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

function EditProduct(props) {
	const item = props.product
	return (
		<form className='product-form' action='/admin/edit-product' method='POST'>
			<input type='hidden' name='_csrf' value={props.csrf} />
			<input type='hidden' name='id' value={item.id} />
			<div className='form-control'>
				<label>Title: </label>
				<input
					type='text'
					placeholder='Enter Product '
					name='title'
					defaultValue={item.title}
				/>
			</div>
			<div className='form-control'>
				<label>Image: </label>
				<input
					type='text'
					placeholder='Enter Image Url '
					name='imgUrl'
					defaultValue={item.imgUrl}
				/>
			</div>
			<div className='form-control'>
				<label>Price: </label>
				<input
					type='number'
					name='price'
					step='0.01'
					defaultValue={item.price}
				/>
			</div>
			<div className='form-control'>
				<label>Description: </label>
				<textarea name='description' rows='5' defaultValue={item.description} />
			</div>
			<button className='btn'>Save Changes</button>
		</form>
	)
}

module.exports = wrapper(Style, EditProduct)
