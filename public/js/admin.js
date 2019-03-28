const deleteProduct = async (csrf, productId, btn) => {
	try {
		const response = await fetch('/admin/delete-product/' + productId, {
			method: 'delete',
			headers: { 'csrf-token': csrf }
		})
		const result = await response.json()
		if (result.message === 'Success') {
			const product = btn.closest('article')
			product.parentNode.removeChild(product)
		}
	} catch (err) {
		console.log(err)
	}
}
