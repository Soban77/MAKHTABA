// import { transactions } from "./history.js";

import { renderTransactions } from "./history.js";

let transactions = [];

async function loadTransaction() {
  const url = new URL(window.location.href);
  const id = url.searchParams.get('userid');

  const res = await fetch(`/transaction/${id}`);
  const t = await res.json();

  transactions = t;

  renderTransactions();
}

await loadTransaction();

async function generateStockSummary() {

  await loadTransaction();

  const sales = transactions.filter(t => t.type === "Sell");
  const purchases = transactions.filter(t => t.type === "Purchase");
  const Rpurchases = transactions.filter(t => t.type === "Return Purchase");
  const Rsales = transactions.filter(t => t.type === "Return Sell");

  const totalSalesQty = sales.reduce((sum, t) => sum + t.quantity, 0);
  const totalSalesValue = sales.reduce((sum, t) => sum + (parseInt(t.price)), 0);

  const RtotalSalesQty = Rsales.reduce((sum, t) => sum + t.quantity, 0);
  const RtotalSalesValue = Rsales.reduce((sum, t) => sum + (parseInt(t.price)), 0);

  const totalPurchaseQty = purchases.reduce((sum, t) => sum + t.quantity, 0);
  const totalPurchaseValue = purchases.reduce((sum, t) => sum + (parseInt(t.price)), 0);

  const RtotalPurchaseQty = Rpurchases.reduce((sum, t) => sum + t.quantity, 0);
  const RtotalPurchaseValue = Rpurchases.reduce((sum, t) => sum + (parseInt(t.price)), 0);

  const TotalSalesQty = totalSalesQty-RtotalSalesQty;
  const TotalPurchaseQty = totalPurchaseQty-RtotalPurchaseQty;

  const TotalPurchaseValue = totalPurchaseValue-RtotalPurchaseValue;
  const TotalSalesValue = totalSalesValue-RtotalSalesValue;

  const html = `
    <div class="stock-card">
      <h2><i class="fa-solid fa-handshake"></i> Total Sales</h2>
      <p><strong>Books Sold:</strong> ${TotalSalesQty}</p>
      <p><strong>Total Sales Value:</strong> Rs. ${TotalSalesValue}</p>
    </div>

    <div class="stock-card">
      <h2><i class="fa-solid fa-cart-shopping"></i> Total Purchases</h2>
      <p><strong>Books Purchased:</strong> ${TotalPurchaseQty}</p>
      <p><strong>Total Purchase Cost:</strong> Rs. ${TotalPurchaseValue}</p>
    </div>
  `;

  document.querySelector('.js-stock-summary').innerHTML = html;
}

generateStockSummary();