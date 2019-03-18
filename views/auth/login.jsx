const React = require('react')
const wrapper = require('../includes/wrapper')

function Style(props) {
	return (
		<>
			<link rel='stylesheet' href='/css/forms.css' />
		</>
	)
}

function Component(props) {
	return (
		<div>
			<form action='/login' method='POST' className='login-form'>
				<div className='form-control'>
					<label>ID:</label>
					<input name='id' placeholder='Email by Default' type='text' />
				</div>
				<div className='form-control'>
					<label>Password:</label>
					<input name='password' placeholder='Password' type='password' />
				</div>
				<div className='form-control'>
					<button className='btn login-btn' type='submit'>
						Login
					</button>
				</div>
			</form>
		</div>
	)
}

module.exports = wrapper(Style, Component)
