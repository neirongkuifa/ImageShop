const React = require('react')

function wrapper(Style, Component) {
	return props => {
		let navPages = {
			'/': 'Shop',
			'/product-list': 'Products'
		}

		if (props.isLoggedIn) {
			navPages = {
				...navPages,
				'/cart': 'Cart',
				'/orders': 'Orders',
				'/admin/product-list': 'Admin Product List',
				'/admin/add-product': 'Add Product'
			}
		}
		return (
			<html lang='en'>
				<head>
					<meta charSet='UTF-8' />
					<meta name='viewport' content='' initial-scale='1.0' />
					<meta httpEquiv='X-UA-Compatible' content='ie=edge' />
					<title>{props.pageTitle}</title>
					<link rel='stylesheet' href='/css/main.css' />
					<link rel='stylesheet' href='/css/auth.css' />
					<link
						href='https://fonts.googleapis.com/css?family=Paytone+One'
						rel='stylesheet'
					/>
					<link
						href='https://fonts.googleapis.com/css?family=Ubuntu+Condensed'
						rel='stylesheet'
					/>
					<Style />
				</head>

				<body>
					<header className='main-header'>
						<nav className='main-header__nav'>
							<ul className='main-header__list'>
								{Object.entries(navPages).map(([url, title]) => (
									<li className='main-header__item' key={url}>
										<a
											className={props.active === url ? 'active' : null}
											href={url}>
											{title}
										</a>
									</li>
								))}
							</ul>
							<ul className='main-header__list main-header__login'>
								{props.isLoggedIn ? (
									<li className='main-header__item'>
										<form action='/logout' method='POST'>
											<input type='hidden' name='_csrf' value={props.csrf} />
											<button className='btn__auth btn__logout'>Logout</button>
										</form>
									</li>
								) : (
									<>
										<li className='main-header__item'>
											<form action='/login' method='GET'>
												<button
													className={
														'btn__auth btn__login ' +
														(props.active === '/login' ||
														props.active === '/reset'
															? 'btn__selected'
															: '')
													}>
													Login
												</button>
											</form>
										</li>
										<li
											className='main-header__item'
											style={{ color: 'white' }}>
											/
										</li>
										<li className='main-header__item'>
											<form action='/signup' method='GET'>
												<button
													className={
														'btn__auth btn__login ' +
														(props.active === '/signup' ? 'btn__selected' : '')
													}>
													Signup
												</button>
											</form>
										</li>
									</>
								)}
							</ul>
						</nav>
					</header>
					<main>
						<Component {...props} />
					</main>
				</body>
			</html>
		)
	}
}

module.exports = wrapper
