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
				<input type='hidden' name='_csrf' value={props.csrf} />
				<div className='form-control'>
					<label>Email:</label>
					<input
						name='email'
						placeholder='Email by Default'
						type='text'
						defaultValue={props.oldInput ? props.oldInput.email : ''}
					/>
				</div>
				<div className='form-control'>
					<label>Password:</label>
					<input
						name='password'
						placeholder='Password'
						type='password'
						defaultValue=''
					/>
				</div>
				<div className='form-control '>
					<button className='btn login-btn' type='submit'>
						Login
					</button>
				</div>
				<div className='form-control btn__reset'>
					<a className='a-reset' href='/reset'>
						Reset Password
					</a>
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
