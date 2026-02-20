// Example: transactions stored in localStorage
// Each transaction: { type: "Purchase"|"Sell", date: "YYYY-MM-DD", bookName, quantity, price }

// let transactions = JSON.parse(localStorage.getItem('transaction')) || [];

// import { transactions } from "./history.js";

import { renderTransactions } from "./history.js";

export function normalizeTimeStr(timeStr) {
  return timeStr
    .replace(/\./g, '')   // remove periods
    .toUpperCase();       // make AM/PM uppercase
}


export function to24Hour(timeStr) {
  // Parse the string into a Date object
  // const date = new Date(`1970-01-01 ${timeStr}`);
  
  // // Extract hours and minutes in 24h format
  // const hours = date.getHours().toString().padStart(2, '0');
  // const minutes = date.getMinutes().toString().padStart(2, '0');
  
  // return `${hours}:${minutes}`;

  timeStr = normalizeTimeStr(timeStr);

  const date = new Date(`1970-01-01 ${timeStr}`);

  // Format back into 24h
  return date.toLocaleTimeString('en-CA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

export function addDays(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  // return date.toISOString().split("T")[0]; // returns YYYY-MM-DD
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" });
}

export function getSameDay(t,date) {
  //t = normalizeTimeStr(t);
  const time24 = to24Hour(t.time);

  // Case 1: same day after 7 PM
  const sameDay = (time24 >= "10:00" && time24 <= "23:59" && t.date === date);

  return sameDay;
}

export function getNextDay(t,date) {
  //t = normalizeTimeStr(t);
  const time24 = to24Hour(t.time);
  // console.log(time24);
  // console.log(t.date);

  const nextDay = (time24 >= "00:00" && time24 < "09:59" && t.date === addDays(date, 1));

  return nextDay;
}

let transactions = [];

async function loadTransaction() {
  const url = new URL(window.location.href);
  const id = url.searchParams.get('userid');

  const res = await fetch(`/transaction/api/${id}`);
  const t = await res.json();

  transactions = t;

  renderTransactions();
}

await loadTransaction();

// const date =  new Date().toISOString().split('T')[0];
// const localDate = new Date().toLocaleDateString('en-CA');
// console.log(localDate);


async function generateReceipt(date) {

  const purchases = transactions.filter(t => t.type === "Purchase" /*&& t.date === date*/ && (getSameDay(t,date) || getNextDay(t,date)));
  const sales = transactions.filter(t => t.type === "Sell" /*&& t.date === date*/ && (getSameDay(t,date) || getNextDay(t,date)));
  const ReturnSales = transactions.filter(t => t.type === "Return Sale" /*&& t.date === date*/ && (getSameDay(t,date) || getNextDay(t,date)));
  const ReturnPurchases = transactions.filter(t => t.type === "Return Purchase" /*&& t.date === date*/ && (getSameDay(t,date) || getNextDay(t,date)));


  let html = '';

  // Purchases
  if (purchases.length > 0) {
    let totalPurchase = purchases.reduce((sum, t) => sum + (parseInt(t.price)), 0);
    let totalQuantity = purchases.reduce((sum, t) => sum + (t.quantity), 0);
    html += `<div class="receipt-card">
      <h2><i class="fa-solid fa-cart-shopping"></i> Purchases</h2>
      <table>
        <tr><th>Book</th><th>Qty</th><th>Price</th><th>Total</th><th>Time</th></tr>
        ${purchases.map(t => `
          <tr>
            <td>${t.book_name}</td>
            <td>${t.quantity}</td>
            <td>Rs. ${t.price/t.quantity}</td>
            <td>Rs. ${t.price}</td>
            <td>${t.time}</td>
          </tr>`).join('')}
      </table>
      <p><strong>Total Purchases:</strong> Rs. ${totalPurchase}</p>
      <p><strong>Total Quantity:</strong> ${totalQuantity}</p>
    </div>`;
  }

  // Sales
  if (sales.length > 0) {
    let totalSales = sales.reduce((sum, t) => sum + (parseInt(t.price)), 0);
    let totalQuantity = sales.reduce((sum, t) => sum + (t.quantity), 0);
    html += `<div class="receipt-card">
      <h2><i class="fa-solid fa-handshake"></i> Sales</h2>
      <table>
        <tr><th>Book</th><th>Qty</th><th>Price</th><th>Total</th><th>Time</th></tr>
        ${sales.map(t => `
          <tr>
            <td>${t.book_name}</td>
            <td>${t.quantity}</td>
            <td>Rs. ${t.price/t.quantity}</td>
            <td>Rs. ${t.price}</td>
            <td>${t.time}</td>
          </tr>`).join('')}
      </table>
      <p><strong>Total Sales:</strong> Rs. ${totalSales}</p>
      <p><strong>Total Quantity:</strong> ${totalQuantity}</p>
    </div>`;
  }

  if (ReturnPurchases.length > 0) {
    let totalPurchase = ReturnPurchases.reduce((sum, t) => sum + (parseInt(t.price)), 0);
    let totalQuantity = ReturnPurchases.reduce((sum, t) => sum + (t.quantity), 0);
    html += `<div class="receipt-card">
      <h2><i class="fa-solid fa-cart-shopping"></i> Return Purchases</h2>
      <table>
        <tr><th>Book</th><th>Qty</th><th>Price</th><th>Total</th><th>Time</th></tr>
        ${ReturnPurchases.map(t => `
          <tr>
            <td>${t.book_name}</td>
            <td>${t.quantity}</td>
            <td>Rs. ${t.price/t.quantity}</td>
            <td>Rs. ${t.price}</td>
            <td>${t.time}</td>
          </tr>`).join('')}
      </table>
      <p><strong>Total Return Purchases:</strong> Rs. ${totalPurchase}</p>
      <p><strong>Total Quantity:</strong> ${totalQuantity}</p>
    </div>`;
  }

  if (ReturnSales.length > 0) {
    let totalPurchase = ReturnSales.reduce((sum, t) => sum + (parseInt(t.price)), 0);
    let totalQuantity = ReturnSales.reduce((sum, t) => sum + (t.quantity), 0);
    html += `<div class="receipt-card">
      <h2><i class="fa-solid fa-cart-shopping"></i> Return Sales</h2>
      <table>
        <tr><th>Book</th><th>Qty</th><th>Price</th><th>Total</th><th>Time</th></tr>
        ${ReturnSales.map(t => `
          <tr>
            <td>${t.book_name}</td>
            <td>${t.quantity}</td>
            <td>Rs. ${t.price/t.quantity}</td>
            <td>Rs. ${t.price}</td>
            <td>${t.time}</td>
          </tr>`).join('')}
      </table>
      <p><strong>Total Return Sales:</strong> Rs. ${totalPurchase}</p>
      <p><strong>Total Quantity:</strong> ${totalQuantity}</p>
    </div>`;
  }

  if (!purchases.length && !sales.length && !ReturnPurchases.length && !ReturnSales.length) {
    html = `<p>No transactions found for ${date}</p>`;
  }

  document.querySelector('.js-receipt-results').innerHTML = html;
}

if(document.querySelector('.js-generate'))
{
  document.querySelector('.js-generate').addEventListener('click', () => {
    const date = document.querySelector('.js-receipt-date').value;

    if (date) {
      generateReceipt(date);
    } else {
      alert("Please select a date");
    }
  });
}