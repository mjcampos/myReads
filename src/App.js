import React from 'react'
import {Route, Link} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Book from './Book'
import BookList from './BookList'

class BooksApp extends React.Component {
    state = {
        list: [],
        searchText: "",
        searchList: []
    }

    onHandleSelection = (bookToUpdate, selectedOption) => {
        BooksAPI.update(bookToUpdate, selectedOption).then(bookIds => {
            // Update list
            BooksAPI.getAll().then(books => {
                var state = this.state;

                state.list = [];

                state.list = books.map(book => {
                    return {
                        id: book.id,
                        backgroundImage: "url(" + book.imageLinks.smallThumbnail + ")",
                        title: book.title,
                        authors: (book.authors) ? book.authors : [],
                        shelf: book.shelf
                    };
                });

                this.setState(state);

                // Update searchList
                this.onUpdateSearchText(this.state.searchText);
            });

        });
    }

    componentWillMount() {
        var state = this.state;

        // When the page first loads a default list is shown
        BooksAPI.getAll().then(books => {
            books.map(book => {
                state.list.push({
                    id: book.id,
                    backgroundImage: "url(" + book.imageLinks.smallThumbnail + ")",
                    title: book.title,
                    authors: (book.authors) ? book.authors : [],
                    shelf: book.shelf
                });

                return true;
            });

            this.setState(state);
        });
    }

    onUpdateSearchText(searchText) {
        var state = this.state;

        // If searchText has value then run a search
        if (searchText.trim().length) {
            BooksAPI.search(searchText, 10).then((data) => {
                BooksAPI.getAll().then(books => {
                    var listIds = books.map(book => book.id);

                    state.searchList = [];

                    // If no errors are found
                    if (!data.error) {
                        var tempHolder = data.filter(book => {
                            for(var i = 0; i < listIds.length; i++) {
                                if (listIds[i] === book.id) return false;
                            }

                            return true;
                        });

                        state.searchList = tempHolder.map(book => {
                            return {
                                id: book.id,
                                backgroundImage: (book.imageLinks) ? ("url(" + book.imageLinks.smallThumbnail + ")") : "url(https://d125fmws0bore1.cloudfront.net/assets/udacity_share-317a7f82552763598a5c91e1550b7cd83663ce02d6d475d703e25a873cd3b574.png)",
                                title: book.title,
                                authors: (book.authors) ? book.authors : [],
                                shelf: "none"
                            };
                        });
                    }

                    this.setState(state);
                })

            });
        } else {
            state.searchList = [];
        }

        state.searchText = searchText;
        this.setState(state);
    }

  render() {
    return (
      <div className="app">
            <Route path="/search" exact render={() => (
                  <div className="search-books">
                    <div className="search-books-bar">
                      <Link className="close-search" to="/">Close</Link>
                      <div className="search-books-input-wrapper">
                        {/*
                          NOTES: The search from BooksAPI is limited to a particular set of search terms.
                          You can find these search terms here:
                          https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                          However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                          you don't find a specific author or title. Every search is limited by search terms.
                        */}
                        <input type="text" placeholder="Search by title or author" onChange={() => this.onUpdateSearchText(document.getElementsByTagName('input')[0].value)} value={this.state.searchText}/>

                      </div>
                    </div>
                    <div className="search-books-results">
                      <ol className="books-grid">
                        {this.state.searchList.map((book) => (
                            <Book key={book.id} handleSelect={this.onHandleSelection} book={book}/>
                        ))}
                      </ol>
                    </div>
                  </div>
            )}/>

            <Route path="/" exact render={({history}) => (
                  <BookList list={this.state.list} onHandleSelection={this.onHandleSelection}/>
            )}/>
      </div>
    )
  }
}

export default BooksApp;