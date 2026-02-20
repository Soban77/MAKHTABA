// import {books} from './home.js';

let books = [];

await loadBooks();

async function loadBooks()
{
  const url = new URL(window.location.href);
  const id = url.searchParams.get('userid');

  const res = await fetch(`/books/${id}`);
  books = await res.json();

  renderBooks(books);
}

export function renderBooks(books1) {

  let html = '';

  books1.forEach((book) => {

    html += `
      <div class="book-bar">
        <div>
          <p>Name</p>
          <p>${book.name}</p>
        </div>
        <div>
          <p>Quantity</p>
          <p>${book.Quantity}</p>
        </div>
        <div>
          <p>Actual Price</p>
          <p>Rs. ${book.Actual_price}</p>
        </div>
        <div>
          <p>Discounted Price</p>
          <p>Rs. ${book.Discounted_price}</p>
        </div>
      </div>
      `;

  });

  if(document.querySelector('.js-book'))
  {
    document.querySelector('.js-book').innerHTML = html;
  }
}

function clicks() {

  if(document.querySelector('.js-search-input'))
  {
    document.querySelector('.js-search-input').addEventListener('input', () => {

      if(document.querySelector('.js-search-input').value !== '')
      {
        let html = '';

        books.forEach((book) => {

          if(book.name.toLowerCase().includes(document.querySelector('.js-search-input').value.toLowerCase()))
          {
            html += `<p class="js-click-sell" data-book-id="${book.id}">${book.name}</p>`;
          }

        });

        document.querySelector('.js-searching-list-b').innerHTML = html;

        document.querySelector('.js-searching-list-b').style.display = "flex";

        document.querySelectorAll('.js-click-sell').forEach((sellSearch) => {
          sellSearch.addEventListener('click', () => {

            const bookId = sellSearch.dataset.bookId;

            books.forEach((book) => {

              if(book.id == bookId)
              {
                document.querySelector('.js-search-input').value = book.name;

                let bi = [];

                bi.push(book);

                renderBooks(bi);
              }

            });

            document.querySelector('.js-searching-list-b').style.display = "none";

          });

        });

      }
      else
      {
        document.querySelector('.js-searching-list-b').style.display = "none";
      }

    });
  }

  if(document.querySelector('.js-search-icon'))
  {
    document.querySelector('.js-search-icon').addEventListener('click', () => {

      let value;

      document.querySelector('.js-searching-list-b').style.display = "none";

      if(document.querySelector('.js-search-input')) {
        value = document.querySelector('.js-search-input').value;
      }

      let b = [];

      books.forEach((book) => {

        if(book.name.toLowerCase().includes(value.toLowerCase()))
        {
          b.push(book);
        }

      });

      document.querySelector('.js-search-input').value = '';
      renderBooks(b);

    });

    document.addEventListener('keydown', (event) => {

      if(event.key === 'Enter')
      {

        document.querySelector('.js-searching-list-b').style.display = "none";
        
        let value;

        if(document.querySelector('.js-search-input')) {
          value = document.querySelector('.js-search-input').value;
        }

        let b = [];

        books.forEach((book) => {

          if(book.name.toLowerCase().includes(value.toLowerCase()))
          {
            b.push(book);
          }

        });

        document.querySelector('.js-search-input').value = '';
        renderBooks(b);
      }

    });
  }
}

function searchSoldOut()
{
  let html = '';

  books.forEach((book) => {

    if(book.Quantity === 0)
    {
      html += `
        <div class="book-bar">
          <div>
            <p>Name</p>
            <p>${book.name}</p>
          </div>
          <div>
            <p>Quantity</p>
            <p>${book.Quantity}</p>
          </div>
          <div>
            <p>Actual Price</p>
            <p>Rs. ${book.Actual_price}</p>
          </div>
          <div>
            <p>Discounted Price</p>
            <p>Rs. ${book.Discounted_price}</p>
          </div>
        </div>
        `;
    }

  });

  if(document.querySelector('.js-book'))
  {
    document.querySelector('.js-book').innerHTML = html;
  }
}

if(document.querySelector('.js-sold-out'))
{
  document.querySelector('.js-sold-out').addEventListener('click', () => {

    searchSoldOut();

  });
}

if(document.querySelector('.js-no-sold-out'))
{
  document.querySelector('.js-no-sold-out').addEventListener('click', () => {

    renderBooks(books);

  });
}

clicks();
renderBooks(books);