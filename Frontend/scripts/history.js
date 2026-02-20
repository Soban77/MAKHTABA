let transactions = [];

// JSON.parse(localStorage.getItem('transaction')) || [];

async function loadTransaction() {

  const url = new URL(window.location.href);
  const id = url.searchParams.get('userid');

  const res = await fetch(`/transaction/${id}`);
  const t = await res.json();

  transactions = t;

  renderTransactions();
}

await loadTransaction();

function getKarachiTimestamp() {
  const date = new Date();
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date).replace(",", "");
}

export async function makeTransaction(type, bookName, quantity, price) {

  const url = new URL(window.location.href);
  const id = url.searchParams.get('userid');

  const transaction = {
    id: Date.now(),
    type,
    bookName,
    quantity,
    price,
    date: new Date().toLocaleDateString('en-CA'), // new Date().toISOString().split('T')[0],
    // time: new Date().toLocaleTimeString('en-CA', { hour: 'numeric', minute: 'numeric', hour12: true }),
    time: new Date().toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
    // timestamp: new Date().toLocaleString(),
    timestamp: getKarachiTimestamp(),
    // new Date().toISOString(),
    receipt: `
      <div class="receipt">
        <h2>${type} Receipt</h2>
        <p><strong>Book:</strong> ${bookName}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Total Price:</strong> Rs. ${price}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `,
    user_id: id
  };

  await fetch('/transaction',{
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(transaction)
  });

  await loadTransaction();

  localStorage.setItem('transaction',JSON.stringify(transactions));

  renderTransactions();
}

export function renderTransactions() {

  const container = document.querySelector('.js-transactions');

  if(container) {
    // container.innerHTML = transactions.map(t => t.receipt).join('');
    container.innerHTML = transactions.slice().reverse().map(t => t.receipt).join('');
  }
}

renderTransactions();