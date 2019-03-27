exports.get404 = (req, res) => {
	res.status(404).render('404', {
		active: req.url,
		pageTitle: 'Page Not Found'
	})
}

exports.get500 = (req, res) => {
	res.status(500).render('500', {
		active: req.url,
		pageTitle: 'Error Occured'
	})
}
