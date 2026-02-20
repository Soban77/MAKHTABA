// import { transactions } from "./history.js";
import { renderTransactions } from "./history.js";
import {getSameDay,getNextDay,to24Hour,addDays,normalizeTimeStr} from "./receipt.js";

let transactions = [];

// JSON.parse(localStorage.getItem('transaction')) || [];

async function loadTransaction() {
  const url = new URL(window.location.href);
  const id = url.searchParams.get('userid');

  const res = await fetch(`/transaction/api/${id}`);
  const t = await res.json();

  transactions = t;

  renderTransactions();
}

await loadTransaction();

export let books = [];
loadBooks();

// JSON.parse(localStorage.getItem('bo')) || [{
//   id: 1,
//   name: 'Manhaj-e-Inqilab',
//   Discounted_price: 250,
//   Actual_price: 500,
//   Quantity: 2
// },
// {
//   id: 2,
//   name: 'Haqeeqat-e-Iqsam-e-Shirk',
//   Discounted_price: 75,
//   Actual_price: 150,
//   Quantity: 3
// }];

async function loadBooks()
{
  const url = new URL(window.location.href);
  const id = url.searchParams.get('userid');

  const res = await fetch(`/books/${id}`);
  books = await res.json();

  renderHome();
}


function renderHome() {

  let bookType = 0;
  let bookTotal = 0;
  let bookPrice = 0;

  let purchaseType = 0;
  let purchaseTotal = 0;
  let purchasePrice = 0;

  let sellType = 0;
  let sellTotal = 0;
  let sellPrice = 0;

  let RpurchaseType = 0;
  let RpurchaseTotal = 0;
  let RpurchasePrice = 0;
  
  let RsellType = 0;
  let RsellTotal = 0;
  let RsellPrice = 0;

  books.forEach((book) => {

    bookType++;
    bookPrice += book.Discounted_price*book.Quantity;
    bookTotal += book.Quantity;

    let foundp = false;
    let founds = false;
    let foundrp = false;
    let foundrs = false;

    transactions.forEach((transaction) => {

      if(transaction.type === 'Purchase' && transaction.book_name === book.name)
      {
        foundp = true;
      }

      if(transaction.type === 'Return Purchase' && transaction.book_name === book.name)
      {
        foundrp = true;
      }

      if(transaction.type === 'Sell' && transaction.book_name === book.name)
      {
        founds = true;
      }

      if(transaction.type === 'Return Sale' && transaction.book_name === book.name)
      {
        foundrs = true;
      }

    });

    if(foundp === true)
    {
      purchaseType++;
    }

    if(founds === true)
    {
      sellType++;
    }

    if(foundrp === true)
    {
      RpurchaseType++;
    }

    if(foundrs === true)
    {
      RsellType++;
    }

  });

  transactions.forEach((book) => {

    if(book.type === 'Purchase' /*|| book.type === 'Return Purchase'*/)
    {
      // if(book.type === 'Purchase')
      // {
      //   purchaseType++;
      //   purchasePrice += book.price*book.quantity;
      //   purchaseTotal += book.quantity;
      // }
      // else
      // {
      //   purchaseType--;
      //   purchasePrice -= book.price*book.quantity;
      //   purchaseTotal -= book.quantity;
      // }

      // purchaseType++;
      purchasePrice += parseInt(book.price);
      purchaseTotal += book.quantity;
    }
    else if(book.type === 'Sell' /*|| book.type === 'Return Sale'*/)
    {
      // if(book.type === 'Sell')
      // {
      //   sellType++;
      //   sellPrice += book.price*book.quantity;
      //   sellTotal += book.quantity;
      // }
      // else
      // {
      //   sellType--;
      //   sellPrice -= book.price*book.quantity;
      //   sellTotal -= book.quantity;
      // }

      // sellType++;
      sellPrice += parseInt(book.price);
      sellTotal += book.quantity;
    }
    else if(book.type === 'Return Purchase')
    {
      // RpurchaseType++;
      RpurchasePrice += parseInt(book.price);
      RpurchaseTotal += book.quantity;
    }
    else if(book.type === 'Return Sale')
    {
      // RsellType++;
      RsellPrice += parseInt(book.price);
      RsellTotal += book.quantity;
    }

  });

  if(document.querySelector('.js-total-book-quantity')) document.querySelector('.js-total-book-quantity').innerHTML = bookTotal;
  if(document.querySelector('.js-total-book-price')) document.querySelector('.js-total-book-price').innerHTML = bookPrice;
  if(document.querySelector('.js-total-book-type')) document.querySelector('.js-total-book-type').innerHTML = bookType;

  if(document.querySelector('.js-total-purchase-quantity')) document.querySelector('.js-total-purchase-quantity').innerHTML = purchaseTotal;
  if(document.querySelector('.js-total-purchase-price')) document.querySelector('.js-total-purchase-price').innerHTML = purchasePrice;
  if(document.querySelector('.js-total-purchase-type')) document.querySelector('.js-total-purchase-type').innerHTML = purchaseType;

  if(document.querySelector('.js-total-sell-quantity')) document.querySelector('.js-total-sell-quantity').innerHTML = sellTotal;
  if(document.querySelector('.js-total-sell-price')) document.querySelector('.js-total-sell-price').innerHTML = sellPrice;
  if(document.querySelector('.js-total-sell-type')) document.querySelector('.js-total-sell-type').innerHTML = sellType;

  if(document.querySelector('.js-return-total-purchase-quantity')) document.querySelector('.js-return-total-purchase-quantity').innerHTML = RpurchaseTotal;
  if(document.querySelector('.js-return-total-purchase-price')) document.querySelector('.js-return-total-purchase-price').innerHTML = RpurchasePrice;
  if(document.querySelector('.js-return-total-purchase-type')) document.querySelector('.js-return-total-purchase-type').innerHTML = RpurchaseType;

  if(document.querySelector('.js-return-total-sell-quantity')) document.querySelector('.js-return-total-sell-quantity').innerHTML = RsellTotal;
  if(document.querySelector('.js-return-total-sell-price')) document.querySelector('.js-return-total-sell-price').innerHTML = RsellPrice;
  if(document.querySelector('.js-return-total-sell-type')) document.querySelector('.js-return-total-sell-type').innerHTML = RsellType;
}

function generateToday(date) {

  const purchases = transactions.filter(t => t.type === "Purchase" && (getSameDay(t,date) || getNextDay(t,date)));
  const sales = transactions.filter(t => t.type === "Sell" && (getSameDay(t,date) || getNextDay(t,date)));
  const ReturnSales = transactions.filter(t => t.type === "Return Sale" && (getSameDay(t,date) || getNextDay(t,date)));
  const ReturnPurchases = transactions.filter(t => t.type === "Return Purchase" && (getSameDay(t,date) || getNextDay(t,date)));

  // console.log(transactions[0].time);
  // console.log(to24Hour(transactions[0].time));
  // console.log(addDays(transactions[0].date,1));
  // console.log(getSameDay(transactions[14].time,date));

  // Purchases
  if (purchases.length > 0) {
    let totalPurchase = 0;
    let totalQuantity = 0;
    totalPurchase = purchases.reduce((sum, t) => sum + (parseInt(t.price)), 0);
    totalQuantity = purchases.reduce((sum, t) => sum + (t.quantity), 0);

    if(document.querySelector('.js-today-total-purchase-quantity') && document.querySelector('.js-today-total-purchase-price'))
    {
      document.querySelector('.js-today-total-purchase-quantity').innerHTML = totalQuantity;
      document.querySelector('.js-today-total-purchase-price').innerHTML = totalPurchase;
    }
  }

  // Sales
  if (sales.length > 0) {
    let totalSales = 0;
    let totalQuantity = 0;
    totalSales = sales.reduce((sum, t) => sum + (parseInt(t.price)), 0);
    totalQuantity = sales.reduce((sum, t) => sum + (t.quantity), 0);

    if(document.querySelector('.js-today-total-sell-quantity') && document.querySelector('.js-today-total-sell-price'))
    {
      document.querySelector('.js-today-total-sell-quantity').innerHTML = totalQuantity;
      document.querySelector('.js-today-total-sell-price').innerHTML = totalSales;
    }
  }

  if (ReturnPurchases.length > 0) {
    let totalPurchase = 0;
    let totalQuantity = 0;
    totalPurchase = ReturnPurchases.reduce((sum, t) => sum + (parseInt(t.price)), 0);
    totalQuantity = ReturnPurchases.reduce((sum, t) => sum + (t.quantity), 0);

    if(document.querySelector('.js-today-return-total-purchase-quantity') && document.querySelector('.js-today-return-total-purchase-price'))
    {
      document.querySelector('.js-today-return-total-purchase-quantity').innerHTML = totalQuantity;
      document.querySelector('.js-today-return-total-purchase-price').innerHTML = totalPurchase;
    }
  }

  if (ReturnSales.length > 0) {
    let totalPurchase = 0;
    let totalQuantity = 0;
    totalPurchase = ReturnSales.reduce((sum, t) => sum + (parseInt(t.price)), 0);
    totalQuantity = ReturnSales.reduce((sum, t) => sum + (t.quantity), 0);
    
    if(document.querySelector('.js-today-return-total-sell-quantity') && document.querySelector('.js-today-return-total-sell-price'))
    {
      document.querySelector('.js-today-return-total-sell-quantity').innerHTML = totalQuantity;
      document.querySelector('.js-today-return-total-sell-price').innerHTML = totalPurchase;
    }
  }
}

// const da = new Date().toISOString().split("T")[0];
const now = new Date();

// Check if current time is before 10:00 AM
if (now.getHours() < 10) {
  // Move to yesterday
  now.setDate(now.getDate() - 1);
}

// Format as YYYY-MM-DD
// const da = now.toISOString().split("T")[0];
const da = now.toLocaleDateString('en-CA');

generateToday(da);
renderHome();