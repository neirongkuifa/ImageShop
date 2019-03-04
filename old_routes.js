const fs = require('fs')
const rqHandler = (req, res) => {
	const url = req.url
	const method = req.method
	if (url === '/') {
		res.write(
			"<html><head><title>Enter Message</title></head><body><form action='/message' method='POST'><input type='text' name='message'><input type='submit' value='Submit'></form></body></html>"
		)
		res.end()
	}
	if (url.startsWith('/message') && method === 'POST') {
		const body = []
		let parsedBody
		req.on('data', chunk => {
			console.log(chunk)
			body.push(chunk)
		})

		req.on('end', () => {
			const rawBody = Buffer.concat(body)
			parsedBody = rawBody.toString()
			console.log(parsedBody)
			fs.writeFileSync('message.txt', parsedBody.split('=')[1])
			res.statusCode = 302
			res.setHeader('Location', '/display')
			res.end()
		})
	}
	if (url.startsWith('/message') && method === 'GET') {
		console.log(req.url)
		res.statusCode = 302
		res.setHeader('Location', '/display')
		res.end()
	}
	if (url === '/display') {
		res.write(
			`<html><head><title>Show Message</title></head><body><p>Received Message: Message Received!~</p></form></body></html>`
		)
		res.end()
	}
}

module.exports = rqHandler
