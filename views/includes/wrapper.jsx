const React = require('react')

function wrapper(Style, Component) {
	/*
	const title = {
		'/': 'Shop',
		'/cart': 'Cart',
		'/orders': 'Orders',
		'/checkout': 'Checkout',
		'/product-list/': 'Product Detail',
		'/product-list': 'Product List',
		'/admin/product-list': 'Admin Product List',
		'/admin/add-product': 'Add Product',
		'/admin/edit-product': 'Edit Product'
	}
	*/
	const navPages = {
		'/': 'Shop',
		'/cart': 'Cart',
		'/orders': 'Orders',
		'/product-list': 'Products',
		'/admin/product-list': 'Admin Product List',
		'/admin/add-product': 'Add Product'
	}

	return props => (
		<html lang='en'>
			<head>
				<meta charSet='UTF-8' />
				<meta name='viewport' content='width= , initial-scale=1.0' />
				<meta httpEquiv='X-UA-Compatible' content='ie=edge' />
				<title>{props.pageTitle}</title>
				<link rel='stylesheet' href='/css/main.css' />
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
					</nav>
				</header>
				<main>
					<Component {...props} />
				</main>
			</body>
		</html>
	)
}

module.exports = wrapper
