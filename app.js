document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const subjectSelect = document.getElementById('subject');
    const availableCheckbox = document.getElementById('available');
    const searchButton = form.querySelector('button[type="submit"]') || form.querySelector('button');
    const statusDiv = document.getElementById('status');
    const resultsTbody = document.querySelector('#results tbody');

    // Exercise 5: Fill in the subject list
    fetch('subjects.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load subjects');
            }
            return response.json();
        })
        .then(subjects => {
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.id;
                option.textContent = subject.name;
                subjectSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading subjects:', error);
        });

    // Exercise 6 & 7: Fetch and display books
    function searchBooks() {
        const params = new URLSearchParams(new FormData(form)).toString();
        
        if (searchButton) searchButton.disabled = true;
        statusDiv.textContent = 'Searching...';

        fetch(`books.php?${params}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }
                return response.json();
            })
            .then(books => {
                resultsTbody.replaceChildren();

                books.forEach(book => {
                    const row = document.createElement('tr');

                    const titleCell = document.createElement('td');
                    titleCell.textContent = book.title;

                    const authorCell = document.createElement('td');
                    authorCell.textContent = book.author;

                    const yearCell = document.createElement('td');
                    yearCell.textContent = book.year;

                    const subjectCell = document.createElement('td');
                    subjectCell.textContent = book.subject;

                    const shelfCell = document.createElement('td');
                    shelfCell.textContent = `${book.available} of ${book.copies}`;
                    if (book.available === 0) {
                        shelfCell.classList.add('out');
                    }

                    row.append(titleCell, authorCell, yearCell, subjectCell, shelfCell);
                    resultsTbody.appendChild(row);
                });

                if (books.length === 0) {
                    statusDiv.textContent = 'No books match your search.';
                } else if (books.length === 1) {
                    statusDiv.textContent = '1 book found.';
                } else {
                    statusDiv.textContent = `${books.length} books found.`;
                }
            })
            .catch(error => {
                console.error('Search error:', error);
                resultsTbody.replaceChildren();
                statusDiv.textContent = "Couldn't load the books. Please try again.";
            })
            .finally(() => {
                if (searchButton) searchButton.disabled = false;
            });
    }

    // Initial load
    searchBooks();

    // Form submit event
    form.addEventListener('submit', event => {
        event.preventDefault();
        searchBooks();
    });

    // Exercise 7: Change events on filters
    subjectSelect.addEventListener('change', searchBooks);
    availableCheckbox.addEventListener('change', searchBooks);
});