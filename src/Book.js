import React from 'react'
import './App.css'

class Book extends React.Component {
	onSelectOption(title, type, element) {
		var elementValue = element[element.selectedIndex].value;

		this.props.handleSelect(title, type, elementValue);
	}

	render() {
		var {book, type}  = this.props;

		return (
			<li>
				<div className="book">
	                <div className="book-top">
	                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: book.backgroundImage }}></div>
	                    <div className="book-shelf-changer">
	                        <select id={book.title} onChange={() => this.onSelectOption(book.title, type, document.getElementById(book.title))} defaultValue={type}>
	                            <option value="none" disabled>Move to...</option>
	                            <option value="currentlyReading">Currently Reading</option>
	                            <option value="wantToRead">Want to Read</option>
	                            <option value="read">Read</option>
	                            <option value="none">None</option>
	                        </select>
	                    </div>
	                </div>

	                <div className="book-title">{book.title}</div>
	                <div className="book-authors">{book.author}</div>
	            </div>
            </li>
		);
	}
};

export default Book;