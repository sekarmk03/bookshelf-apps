document.addEventListener("DOMContentLoaded", function(){
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function(event){
        event.preventDefault();
        addBook();
    });

    changeButtonSubmit();

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan.");
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});