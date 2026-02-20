// import { books } from "./home.js";
import { renderBooks } from "./book.js";
import { makeTransaction,renderTransactions } from "./history.js";

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

function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.style.display = "block";

  // auto-hide after 3 seconds
  setTimeout(() => {
    successMessage.style.display = "none";
  }, 3000);

}

if(document.querySelector('.js-add-book'))
{
  document.querySelector('.js-add-book').addEventListener('click', async () => {

    if(parseInt(document.querySelector('.js-new-quantity').value)>0 && parseInt(document.querySelector('.js-new-price').value)>0 && document.querySelector('.js-new-discount-price').value>0)
    {
      // books.push({
      //   name: document.querySelector('.js-new-name').value,
      //   Quantity: parseInt(document.querySelector('.js-new-quantity').value),
      //   Actual_price: parseInt(document.querySelector('.js-new-price').value),
      //   Discounted_price: parseInt(document.querySelector('.js-new-discount-price').value) // adjust logic
      // });

      const url = new URL(window.location.href);
      const id = url.searchParams.get('userid');

      // const cont = await fetch('/count');
      // const dat = await cont.json();

      // const totalBooks = parseInt(dat.total_books, 10);

      const cont = await fetch('/total/bu');
      const dat = await cont.json();

      const newB = {
        id: dat.length+1,
        // id: totalBooks+1,
        name: document.querySelector('.js-new-name').value,
        Quantity: parseInt(document.querySelector('.js-new-quantity').value),
        Actual_price: parseInt(document.querySelector('.js-new-price').value),
        Discounted_price: parseInt(document.querySelector('.js-new-discount-price').value),
        user_id: id
      };

      const res = await fetch('/books',{
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(newB)
      });

      const rp =  await res.json();

      if(rp.error === true)
      {
        alert('Book name already exists!');
      }
      else
      {
        loadBooks();

        let name = document.querySelector('.js-new-name').value;
        let qty = parseInt(document.querySelector('.js-new-quantity').value);
        let price = parseInt(document.querySelector('.js-new-price').value);
        let discount_price = parseInt(document.querySelector('.js-new-discount-price').value);

        // Add book logic...
        makeTransaction("Purchase", name, qty, discount_price * qty);

        // localStorage.setItem('bo',JSON.stringify(books));

        document.querySelector('.js-new-name').value = '';
        document.querySelector('.js-new-quantity').value = '';
        document.querySelector('.js-new-price').value = '';
        document.querySelector('.js-new-discount-price').value = '';

        showSuccess("Book Added Successfully!");

        renderBooks(books);
      }
    }
    else
    {
      if(!parseInt(document.querySelector('.js-new-quantity').value) || !document.querySelector('.js-new-price').value || !document.querySelector('.js-new-discount-price').value)
      {
        alert('Information Missing!');
      }
      else if(parseInt(document.querySelector('.js-new-quantity').value)<1) {

        alert('Quantity Cannot Be Negative!');

      } 
      else if(parseInt(document.querySelector('.js-new-price').value)<1 || parseInt(document.querySelector('.js-new-discount-price').value)<1)
      {
        alert('Price Cannot be Negative!');
      }
    }

  });
}

if(document.querySelector('.js-update-book'))
{
  document.querySelector('.js-update-book').addEventListener('click',async () => {

    document.querySelector('.js-update-searching-list').style.display = "none";

    let name = document.querySelector('.js-update-name').value;
    let qty = parseInt(document.querySelector('.js-update-quantity').value);
    let book = books.find(b => b.name === name);

    if(!book || !qty || qty<1)
    {
      if(!book)
      {
        alert('Wrong Book Name!');
      }
      else if(qty<1)
      {
        alert('Wrong Quantity');
      }
      else if(!qty)
      {
        alert('Quantity Required!');
      }
    }
    else if(document.querySelector('.js-update-price').value<0)
    {
      alert('Wrong Price!');
    }
    else
    {
      if(book) book.Quantity += qty;

      let price;

      if(!document.querySelector('.js-update-price').value)
      {
        price = book.Discounted_price;
      }
      else
      {
        price = document.querySelector('.js-update-price').value;
      }

      await fetch('/books',{
        method: 'PATCH',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          id: book.id,
          quantity: book.Quantity,
          price: book.price
        })
      });

      loadBooks();

      showSuccess("Book Purchased Successfully!");

      makeTransaction("Purchase", name, qty, price * qty);

      // localStorage.setItem('bo',JSON.stringify(books));

      document.querySelector('.js-update-name').value = '';
      document.querySelector('.js-update-quantity').value = '';
      document.querySelector('.js-update-price').value = '';

      renderBooks(books);
    }
  });
}

if(document.querySelector('.js-sell-book'))
{
  document.querySelector('.js-sell-book').addEventListener('click',async () => {

    document.querySelector('.js-searching-list').style.display = "none";

    let name = document.querySelector('.js-sell-name').value;
    let qty = parseInt(document.querySelector('.js-sell-quantity').value);
    let book = books.find(b => b.name === name);

    if(!book || book.Quantity<qty || qty<1 || !qty || document.querySelector('.js-sell-price').value<0)
    {
      if(!book)
      {
        alert('Wrong Book Name!');
      }
      else if(!qty)
      {
        alert('Quantity Required!');
      }
      else if(book.Quantity<qty || qty<1)
      {
        alert('Wrong Quantity');
      }
      else if(document.querySelector('.js-sell-price').value<0)
      {
        alert('Price cannot be negative!');
      }
    }
    else
    {
      if(book && book.Quantity >= qty) book.Quantity -= qty;

      let price = book.price;
      let discount_price; // Example: you can fetch actual book price
      if(!document.querySelector('.js-sell-price').value)
      {
        discount_price = book.Discounted_price;
      }
      else
      {
        discount_price = document.querySelector('.js-sell-price').value;
      }

      await fetch('/books',{
        method: 'PATCH',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          id: book.id,
          quantity: book.Quantity,
          price: book.price
        })
      });

      loadBooks();

      // Sell logic...
      makeTransaction("Sell", name, qty, discount_price * qty);

      // localStorage.setItem('bo',JSON.stringify(books));

      showSuccess("Book Sold Successfully!");

      document.querySelector('.js-sell-name').value = '';
      document.querySelector('.js-sell-quantity').value = '';
      document.querySelector('.js-sell-price').value = '';

      renderBooks(books);
    }

  });

}

if(document.querySelector('.js-sell-name'))
{
  document.querySelector('.js-sell-name').addEventListener('input',async () => {

    await loadBooks();

    if(document.querySelector('.js-sell-name').value !== '')
    {
      let html = '';

      books.forEach((book) => {

        if(book.name.toLowerCase().includes(document.querySelector('.js-sell-name').value.toLowerCase()))
        {
          html += `<p class="js-click-sell" data-book-id="${book.id}">${book.name}</p>`;
        }

      });

      document.querySelector('.js-searching-list').innerHTML = html;

      document.querySelector('.js-searching-list').style.display = "flex";

      document.querySelectorAll('.js-click-sell').forEach((sellSearch) => {
        sellSearch.addEventListener('click', () => {

          const bookId = sellSearch.dataset.bookId;

          books.forEach((book) => {

            if(book.id == bookId)
            {
              document.querySelector('.js-sell-name').value = book.name;
              document.querySelector('.js-sell-price').value = book.Discounted_price;
            }

          });

          document.querySelector('.js-searching-list').style.display = "none";

        });

      });

    }
    else
    {
      document.querySelector('.js-searching-list').style.display = "none";
    }

  });
}

if(document.querySelector('.js-return-sale-name'))
{
  document.querySelector('.js-return-sale-name').addEventListener('input', () => {

    loadBooks();

    if(document.querySelector('.js-return-sale-name').value !== '')
    {
      let html = '';

      books.forEach((book) => {

        if(book.name.toLowerCase().includes(document.querySelector('.js-return-sale-name').value.toLowerCase()))
        {
          html += `<p class="js-click-return-sell" data-book-id="${book.id}">${book.name}</p>`;
        }

      });

      document.querySelector('.js-searching-lisT').innerHTML = html;

      document.querySelector('.js-searching-lisT').style.display = "flex";

      document.querySelectorAll('.js-click-return-sell').forEach((sellSearch) => {
        sellSearch.addEventListener('click', () => {

          const bookId = sellSearch.dataset.bookId;

          books.forEach((book) => {

            if(book.id == bookId)
            {
              document.querySelector('.js-return-sale-name').value = book.name;
              document.querySelector('.js-return-sale-price').value = book.Discounted_price;
            }

          });

          document.querySelector('.js-searching-lisT').style.display = "none";

        });

      });

    }
    else
    {
      document.querySelector('.js-searching-lisT').style.display = "none";
    }

  });
}

if(document.querySelector('.js-update-name'))
{
  document.querySelector('.js-update-name').addEventListener('input', () => {

    loadBooks();

    if(document.querySelector('.js-update-name').value !== '')
    {
      let html = '';

      books.forEach((book) => {

        if(book.name.toLowerCase().includes(document.querySelector('.js-update-name').value.toLowerCase()))
        {
          html += `<p class="js-click-sell" data-book-id="${book.id}">${book.name}</p>`;
        }

      });

      document.querySelector('.js-update-searching-list').innerHTML = html;

      document.querySelector('.js-update-searching-list').style.display = "flex";

      document.querySelectorAll('.js-click-sell').forEach((sellSearch) => {
        sellSearch.addEventListener('click', () => {

          const bookId = sellSearch.dataset.bookId;

          books.forEach((book) => {

            if(book.id == bookId)
            {
              document.querySelector('.js-update-name').value = book.name;
              document.querySelector('.js-update-price').value = book.Discounted_price;
            }

          });

          document.querySelector('.js-update-searching-list').style.display = "none";

        });

      });

    }
    else
    {
      document.querySelector('.js-update-searching-list').style.display = "none";
    }

  });
}

if(document.querySelector('.js-return-purchase-name'))
{
  document.querySelector('.js-return-purchase-name').addEventListener('input', () => {

    loadBooks();

    if(document.querySelector('.js-return-purchase-name').value !== '')
    {
      let html = '';

      books.forEach((book) => {

        if(book.name.toLowerCase().includes(document.querySelector('.js-return-purchase-name').value.toLowerCase()))
        {
          html += `<p class="js-click-sell1" data-book-id="${book.id}">${book.name}</p>`;
        }

      });

      document.querySelector('.js-return-update-searching-list').innerHTML = html;

      document.querySelector('.js-return-update-searching-list').style.display = "flex";

      document.querySelectorAll('.js-click-sell1').forEach((sellSearch) => {
        sellSearch.addEventListener('click', () => {

          const bookId = sellSearch.dataset.bookId;

          books.forEach((book) => {

            if(book.id == bookId)
            {
              document.querySelector('.js-return-purchase-name').value = book.name;
              document.querySelector('.js-return-purchase-price').value = book.Discounted_price;
            }

          });

          document.querySelector('.js-return-update-searching-list').style.display = "none";

        });

      });

    }
    else
    {
      document.querySelector('.js-return-update-searching-list').style.display = "none";
    }

  });
}

if(document.querySelector('.js-delete-book'))
{
  document.querySelector('.js-delete-book').addEventListener('click',async () => {

    let name = document.querySelector('.js-delete-name').value;
    const index = books.findIndex(b => b.name === name);

    if (index !== -1) {
      const b = books.find(book => book.name === name);
      books.splice(index, 1); // ✅ removes the book

      await fetch(`/books/${b.id}`,{
        method: 'DELETE'
      });

      loadBooks();

      // localStorage.setItem('bo',JSON.stringify(books));

      document.querySelector('.js-delete-name').value = '';

      showSuccess("Book Deleted Successfully!");
      renderBooks(books);
    }
    else {
      alert('Wrong book Name!');
    }
  
  });
}

if(document.querySelector('.js-return-purchase'))
{
  document.querySelector('.js-return-purchase').addEventListener('click',async () => {

    document.querySelector('.js-return-update-searching-list').style.display = "none";

    let name = document.querySelector('.js-return-purchase-name').value;
    let qty = parseInt(document.querySelector('.js-return-purchase-quantity').value);
    let book = books.find(b => b.name === name);

    if(!book)
    {
      alert('Wrong Book Name!');
    }
    else if(book && qty<1 || !qty)
    {
      if(qty<1) 
      {  
        alert('Wrong Quantity!');
      }
      else if(!qty)
      {
        alert('Quantity Required!');
      }
      
    }
    else if(document.querySelector('.js-return-purchase-price').value<0)
    {
      alert('Wrong Price!');
    }
    else if(book && book.Quantity<qty)
    {
      alert('Not Enough Books!');
    }
    else
    {
      if(book && book.Quantity >= qty) book.Quantity -= qty;

      let price;
      
      if(!document.querySelector('.js-return-purchase-price').value)
      {
        price = book.Discounted_price;
      }
      else
      {
        price = document.querySelector('.js-return-purchase-price').value;
      }
      // book.Discounted_price; // Example: you can fetch actual book price

      // Return logic...
      makeTransaction("Return Purchase", name, qty, price * qty);

      await fetch('/books',{
        method: 'PATCH',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          id: book.id,
          quantity: book.Quantity,
          price: book.price
        })
      });

      loadBooks();

      // localStorage.setItem('bo',JSON.stringify(books));

      showSuccess("Purchased Book Returned Successfully!");

      document.querySelector('.js-return-purchase-name').value = '';
      document.querySelector('.js-return-purchase-quantity').value = '';
      document.querySelector('.js-return-purchase-price').value = '';

      renderBooks(books);
    }
    

  });
}

if(document.querySelector('.js-return-sale'))
{
  document.querySelector('.js-return-sale').addEventListener('click',async () => {

    document.querySelector('.js-searching-lisT').style.display = "none";

    let name = document.querySelector('.js-return-sale-name').value;
    let qty = parseInt(document.querySelector('.js-return-sale-quantity').value);
    let book = books.find(b => b.name === name);

    if(!book)
    {
      alert('Wrong Book Name!');
    }
    else if(book && qty<1 || !qty)
    {
      if(qty<1) 
      {  
        alert('Wrong Quantity!');
      }
      else if(!qty)
      {
        alert('Quantity Required!');
      }
    }
    else if(document.querySelector('.js-return-sale-price').value<0)
    {
      alert('Wrong Price!');
    }
    else
    {
      if(book) book.Quantity += qty;

      let price;
      
      if(!document.querySelector('.js-return-sale-price').value)
      {
        price = book.Discounted_price;
      }
      else
      {
        price = document.querySelector('.js-return-sale-price').value;
      }
       
      // book.Discounted_price; // Example: you can fetch actual book price

      // Return logic...
      makeTransaction("Return Sale", name, qty, price * qty);

      await fetch('/books',{
        method: 'PATCH',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          id: book.id,
          quantity: book.Quantity,
          price: book.price
        })
      });

      loadBooks();

      // localStorage.setItem('bo',JSON.stringify(books));

      showSuccess("Book Sold Returned Successfully!");

      document.querySelector('.js-return-sale-name').value = '';
      document.querySelector('.js-return-sale-quantity').value = '';
      document.querySelector('.js-return-sale-price').value = '';

      renderBooks(books);
    }
    
  });
}