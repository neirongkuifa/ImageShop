const React = require('react')

function Pagination(props) {
	return (
		<section className='pagination'>
			{props.currentPage === 1 ? null : (
				<a href={props.path + '/?page=' + props.prevPage}>Previous Page</a>
			)}
			<a href={props.path + '/?page=' + props.currentPage} className='active'>
				{props.currentPage}
			</a>
			{props.currentPage === props.lastPage ? null : (
				<a href={props.path + '/?page=' + props.nextPage}>Next Page</a>
			)}
		</section>
	)
}

module.exports = Pagination
