// ES6 Book Class 
class Book {
    constructor(title, author, genre, price, publisher, image) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.price = price;
        this.publisher = publisher;
        this.image = image;
    }
}

function parseBooks(xmlString) {
    let bookCollection = [];
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xmlString, "text/xml");
    let books = xmlDoc.getElementsByTagName("book");
    for (var index = 0; index < books.length; index++) {
        let book = getBookFromXml(books[index]);
        bookCollection.push(book);
    }
    return bookCollection;
}

// Retrieve data from XML
function getBookFromXml(xml) {
    let title = getValueFromNode(xml, "title");
    let author = getValueFromNode(xml, "author");
    let genre = getValueFromNode(xml, "genre");
    let price = getValueFromNode(xml, "price");
    let publisher = getValueFromNode(xml, "publisher");
    let image = getValueFromNode(xml, "image");
    return new Book(title, author, genre, price, publisher, image);
}

function getValueFromNode(node, name) {
    let elements = node.getElementsByTagName(name);
    return elements && elements.length > 0 ? elements[0].childNodes[0].nodeValue : "";
}

var app = new Vue({
    el: '#bookShop',
    data: {
        search: '',
        books: [],
        page: 1,
        // max 10 products per page
        increment: 10
    },
    computed: {
        booksToShow: function() {
            return this.books.slice(0, this.page * this.increment);
        }
    },
    mounted: function() {
        var self = this;
        axios.get('../database/xmlFromDbBooks.xml').then(response => {
            self.books = parseBooks(response.data);
        });

        document.addEventListener("scroll", function(event) {
            if (self.hasReachedBottom()) {
                self.showNext();
            }
        });
    },
    methods: {
        matchesFilter: function(book) {
            const searchKey = this.search;
            if (!searchKey) {
                return true;
            }

            // Include lowercase searches
            if (book.title.toLowerCase().includes(searchKey) || book.author.toLowerCase().includes(searchKey) ||
                book.genre.toLowerCase().includes(searchKey) || book.publisher.toLowerCase().includes(searchKey) ||
                book.price.toString().includes(searchKey)) {
                return true;
            } else {
                return false;
            }
        },

        // Infinite scroll function
        hasReachedBottom: function() {
            var lastItem = document.querySelector("#books > div:last-child");
            var lastItemOffset = lastItem.offsetTop + lastItem.clientHeight;
            var pageOffset = window.pageYOffset + window.innerHeight;
            return pageOffset > lastItemOffset - 20;
        },
        showNext: function() {
            this.page++;
        }
    }
});