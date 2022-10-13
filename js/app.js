// Book class: represent a book
class Book {
    constructor(title, auther,isbn) {
        this.title = title;
        this.auther = auther;
        this.isbn = isbn;
    }
}


// UI Class: Handle UI tasks
 class UI {
    static displayBooks() {
        const books = Store.getBooks();
            
        books.forEach((book) =>UI.addBookToList(book));
    }

    static addBookToList (book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.auther}</td>
            <td>${book.isbn}</td>
            <td><a href = '#' class = 'btn btn-danger btn-sm delete'>X</a></td>
        `;
        list.appendChild(row);
    }
    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // vanish in 3 sec

        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 3000);


    }

    static clearFields() {
    document.querySelector('#title').value = "";
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
    }
 }

//Store Class: Handle Storage
class Store {
    static getBooks() {
        let books;

        if (localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));

    }  

    static removeBook(isbn) {

        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index,1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));

    }
}


// Event: Display book
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //prevent actual submit
    e.preventDefault();

    //get form values
    let title = document.querySelector('#title').value;
    let auther = document.querySelector('#author').value;
    let isbn = document.querySelector('#isbn').value;

    //validate
    if (title === '' || auther === '' || isbn === '') {
        UI.showAlert('please fill in all fields', 'danger');
    } else {
        // instatiate a book
        const book = new Book(title, auther, isbn);

        //add book to UI

        UI.addBookToList(book);


        // add book to store

        Store.addBook(book);

        
        //show a success message
        UI.showAlert('Book Added', 'success');

        // clear fields
        UI.clearFields();
    }

    
});

//event: Remove a book

document.querySelector('#book-list').addEventListener('click', (e) => {
    //remove book from UI
    UI.deleteBook(e.target);

    //book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);


    //show a success message
    UI.showAlert('Book Removed', 'success');
})