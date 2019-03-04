exports.getPageNotFound = (req, res) => {
	res
		.status(404)
		.render('page-not-found', { active: req.url, pageTitle: 'Page Not Found' })
}
