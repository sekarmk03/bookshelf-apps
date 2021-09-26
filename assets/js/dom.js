const UNCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

function changeButtonSubmit(){
    const buttonSubmit = document.querySelector("#bookSubmit > span");
    const checkbox = document.getElementById("inputBookIsComplete");

    checkbox.addEventListener("change", function(event){
        if(checkbox.checked){
            console.log("selesai");
            buttonSubmit.innerText = "Complete Reading";
        } else {
            console.log("belum");
            buttonSubmit.innerText = "Incomplete Reading";
        }
    });
}

function makeBook(title, author, year, isCompleted) {
    const textTitle = document.createElement("h3");
    textTitle.innerText = title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = `Author: ${author}`;

    const textYear = document.createElement("p");
    textYear.innerText = `Year: ${year}`;

    const detailContainer = document.createElement("div");
    detailContainer.classList.add("detail_book");
    detailContainer.append(textTitle, textAuthor, textYear);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");

    if(isCompleted){
        buttonContainer.append(createUndoButton(), createTrashButton());
    } else {
        buttonContainer.append(createCheckButton(), createTrashButton());
    }
    
    const container = document.createElement("article");
    container.classList.add("book_item");
    // container.append(detailContainer, buttonContainer);
    container.append(textTitle, textAuthor, textYear, buttonContainer);

    return container;
}

function createUndoButton(){
    return createButton("green", '<i class="fas fa-undo-alt"></i>', function(event){
        undoBookFromCompleted(event.target.parentElement.parentElement.parentElement);
    });
}

function createTrashButton(){
    return createButton("red", '<i class="fas fa-trash-alt"></i>', function(event){
        removeBookFromList(event.target.parentElement.parentElement.parentElement);
    });
}

function createCheckButton(){
    return createButton("green", '<i class="fas fa-check"></i>', function(event){
        addBookToCompleted(event.target.parentElement.parentElement.parentElement);
    });
}

function createButton(buttonTypeClass, buttonText, eventListener){
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerHTML = buttonText;
    button.addEventListener("click", function(event){
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}

function addBook(){
    const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const completedBookList = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const textTitle = document.getElementById("inputBookTitle").value;
    const textAuthor = document.getElementById("inputBookAuthor").value;
    const textYear = document.getElementById("inputBookYear").value;
    const isCompleted = document.getElementById("inputBookIsComplete").checked;

    const book = makeBook(textTitle, textAuthor, textYear, isCompleted);
    let bookObject = composeBookObject(textTitle, textAuthor, textYear, isCompleted);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    console.log(bookObject);

    if(isCompleted){
        completedBookList.append(book);
    } else {
        uncompletedBookList.append(book);
    }

    resetForm();
    updateDataToStorage();
}

function addBookToCompleted(bookElement){
    const bookTitle = bookElement.querySelector(".book_item > h3").innerText;
    const bookAuthor = bookElement.querySelectorAll(".book_item > p")[0].innerText.replace("Author: ", "");
    const bookYear = bookElement.querySelectorAll(".book_item > p")[1].innerText.replace("Year: ", "");

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    listCompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function removeBookFromList(bookElement){
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);

    const deleteConfirmation = confirm(`${books[bookPosition].title} will be deleted. Are you sure?`);

    if(deleteConfirmation){
        books.splice(bookPosition, 1);
        bookElement.remove();
    }

    updateDataToStorage();
}

function undoBookFromCompleted(bookElement){
    const bookTitle = bookElement.querySelector(".book_item > h3").innerText;
    const bookAuthor = bookElement.querySelectorAll(".book_item > p")[0].innerText.replace("Author: ", "");
    const bookYear = bookElement.querySelectorAll(".book_item > p")[1].innerText.replace("Year: ", "");
    
    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);
    
    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;
    
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    listUncompleted.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function searchBook(){
    const input = document.getElementById("searchBookTitle").value.toLowerCase();
    const bookItem = document.querySelectorAll(".book_item");
    for(let i = 0; i < bookItem.length; i++){
        const title = bookItem[i].getElementsByTagName("h3");
        if(title[0]){
            const cell = title[0].textContent || title[0].innerHTML || title[0].innerText;
            cell.toLowerCase().indexOf(input) > -1
            ? (bookItem[i].style.display = "")
            : (bookItem[i].style.display = "none");
        }
    }
}

function resetForm(){
    document.getElementById("inputBookTitle").value = "";
    document.getElementById("inputBookAuthor").value = "";
    document.getElementById("inputBookYear").value = "";
    document.getElementById("inputBookIsComplete").checked = false;
}