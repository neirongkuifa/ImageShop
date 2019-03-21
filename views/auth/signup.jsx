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
			<form action='/signup' method='POST' className='login-form'>
				<input type='hidden' name='_csrf' value={props.csrf} />
				<div className='form-control'>
					<label>Username:</label>
					<input
						name='username'
						placeholder='Username'
						type='text'
						value={props.oldInput ? props.oldInput.username : null}
					/>
				</div>
				<div className='form-control'>
					<label>Email:</label>
					<input
						name='email'
						placeholder='Email Address'
						type='text'
						value={props.oldInput ? props.oldInput.email : null}
					/>
				</div>
				<div className='form-control'>
					<label>Password:</label>
					<input name='password' placeholder='Password' type='password' />
				</div>
				<div className='form-control'>
					<label>Confirm Password:</label>
					<input
						name='confirmedPassword'
						placeholder='Confirm Password'
						type='password'
					/>
				</div>
				<div className='form-control'>
					<button className='btn login-btn' type='submit'>
						Signup
					</button>
				</div>
				{props.errMsg ? (
					<div style={{ color: 'red', width: '20rem', margin: 'auto' }}>
						{props.errMsg}
					</div>
				) : null}
			</form>
		</div>
	)
}

module.exports = wrapper(Style, Component)
