import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types' 
import escapeRegExp from 'escape-string-regexp'
import * as BooksAPI from './BooksAPI'

class SearchBook extends React.Component {

  static propTypes = {
    books: PropTypes.array.isRequired,
    updateAllShelfs: PropTypes.func.isRequired
  }

  state = {
    query:'',
    apibooks: []
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim() })
      if (query !== '') {
        BooksAPI.search(query).then((apibooks) => {

          if (typeof apibooks === 'undefined' || apibooks.error) return

          for (let book of this.props.books) {
            apibooks = apibooks.map(b => {
              if (book.id === b.id) {
                b.shelf = book.shelf
              }
              return b
            })
          }
        
          this.setState({ apibooks })
        })
      }
  }

  updateShelf = (book, shelf) => {  
    BooksAPI.update(book, shelf).then(() => {
      this.setState((state) => ({
        apibooks: state.apibooks.map((b) => (this.updateBookShelfState(b, book, shelf)))      
      }))  
    }) 
    this.updateAllShelfs(book)
  }

  updateBookShelfState = (b, book, shelf) => {
    if(b.id === book.id) b.shelf = shelf
    return b
  }

  updateAllShelfs(book) {
    
    for (let b of this.props.books) {
      let isBookInTheShelf = false
      if (book.id === b.id) {
        isBookInTheShelf = true
        break
      }
      if (!isBookInTheShelf)
        this.props.updateAllShelfs()
    }
  }

  matchQuery(book, query) {
    const match = new RegExp(escapeRegExp(query), 'i');
    return match.test(book.title) ? match.test(book.title) : match.test(book.authors)
  }

  render () {

    const { query, apibooks } = this.state

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">Close</Link>
          <div className="search-books-input-wrapper">
            <input 
            type="text" 
            placeholder="Search by title or author"
            value={query}
            onChange={(event) => this.updateQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
          {apibooks.map((book) => (
            <li key={book.id}>
              <div className="book">
                <div className="book-top">
                  <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks !== undefined? book.imageLinks.thumbnail:''})` }}></div>
                  <div className="book-shelf-changer">
                    <select value={book.shelf !== undefined? book.shelf : 'none'} onChange={(event) => this.updateShelf(book, event.target.value)}>
                      <option value="none" disabled>Move to...</option>
                      <option value="currentlyReading">Currently Reading</option>
                      <option value="wantToRead">Want to Read</option>
                      <option value="read">Read</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
                <div className="book-title">{book.title}</div>
                <div className="book-authors">{book.authors}}</div>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    )
  }
}

export default SearchBook