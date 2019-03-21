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
			<form
				action={'/reset/' + props.resetToken}
				method='POST'
				className='login-form'>
				<input type='hidden' name='userId' value={props.id} />
				<input type='hidden' name='_csrf' value={props.csrf} />
				<div className='form-control'>
					<label>Password:</label>
					<input name='password' placeholder='Password' type='password' />
				</div>
				<div className='form-control'>
					<label>Confirm Password:</label>
					<input
						name='confirmedPassword'
						placeholder='Password'
						type='password'
					/>
				</div>
				<div className='form-control'>
					<button className='btn login-btn' type='submit'>
						Reset
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
