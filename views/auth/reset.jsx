const React = require('react')
const wrapper = require('../includes/wrapper')

function Style(props) {
	return (
		<>
			<link rel='stylesheet' href='/css/forms.css' />
			<link rel='stylesheet' href='/css/auth.css' />
		</>
	)
}

function Component(props) {
	return (
		<div>
			<form action='/reset' method='POST' className='login-form'>
				<input type='hidden' name='_csrf' value={props.csrf} />
				<div className='form-control'>
					<label>Email:</label>
					<input
						name='email'
						placeholder='Email by Default'
						type='text'
						defaultValue={props.oldInput || ''}
					/>
				</div>
				<div className='form-control'>
					<button className='btn login-btn' type='submit'>
						Send Link
					</button>
				</div>
			</form>
			{props.errMsg ? (
				<div style={{ color: 'red', width: '20rem', margin: 'auto' }}>
					{props.errMsg}
				</div>
			) : null}
		</div>
	)
}

module.exports = wrapper(Style, Component)
