import React from 'react'
import { Route, Link } from 'react-router-dom'
import BookShelf from './BookShelf'
import SearchBook from './SearchBook'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {

  state = {
    books: []
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
    })
  }

  updateShelf = (book, shelf) => {
    BooksAPI.update(book, shelf).then(() => {
      this.setState((state) => ({
        books: state.books.map((b) => (this.updateBookShelfState(b, book, shelf)))
      }))
    })
  }

  updateBookShelfState = (b, book, shelf) => {
    if(b.id === book.id) b.shelf = shelf
    return b
  }

  render() {
    return (
      <div className="app">
        <Route path="/search" render={() => (
          <SearchBook
            books={this.state.books}
            onUpdateShelf={this.updateShelf}
          />
        )}/>
        <Route path="/" exact render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <BookShelf
                bookshelfTitle={"Currently Reading"}
                selectedBookshelf={"currentlyReading"}
                books={this.state.books}
                onUpdateShelf={this.updateShelf}
              />
              <BookShelf 
                bookshelfTitle={"Want to Read"}
                selectedBookshelf={"wantToRead"}
                books={this.state.books}
                onUpdateShelf={this.updateShelf}
              />
              <BookShelf
                bookshelfTitle={"Read"}
                selectedBookshelf={"read"}
                books={this.state.books}
                onUpdateShelf={this.updateShelf}
              />
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )}/>
      </div>
    )
  }
}

export default BooksApp
