const url1 = new URL(window.location.href);
const id1 = url1.searchParams.get('userid');

if(id1 == 2)
{
  document.querySelector('.js-ladies-section').style.display = "flex";
}

const h = document.querySelector('.js-home');

if(h)
{
  h.addEventListener('click', () => {

    const url = new URL(window.location.href);
    const id = url.searchParams.get('userid');

    window.location.href = `home.html?userid=${id}`;

  });
}

const b = document.querySelector('.js-books');

if(b)
{
  b.addEventListener('click', () => {

    const url = new URL(window.location.href);
    const id = url.searchParams.get('userid');

    window.location.href = `book.html?userid=${id}`;

  });
}

const p = document.querySelector('.js-purchase');

if(p)
{
  p.addEventListener('click', () => {

    const url = new URL(window.location.href);
    const id = url.searchParams.get('userid');

    window.location.href = `purchase.html?userid=${id}`;

  });
}

const s = document.querySelector('.js-sell');

if(s)
{
  s.addEventListener('click', () => {

    const url = new URL(window.location.href);
    const id = url.searchParams.get('userid');

    window.location.href = `sell.html?userid=${id}`;

  });
}

const t = document.querySelector('.js-history');
  
if(t)
{
  t.addEventListener('click', () => {

    const url = new URL(window.location.href);
    const id = url.searchParams.get('userid');

    window.location.href = `history.html?userid=${id}`;

  });
}

const si = document.querySelector('.js-signout');

if(si)
{
  si.addEventListener('click', () => {

    // const url = new URL(window.location.href);
    // const id = url.searchParams.get('userid');

    // window.location.href = `signout.html?userid=${id}`;

    const confirmButton = document.querySelector('.js-confirmation');

    if(confirmButton)
    {
      confirmButton.style.display = "flex";
    }

    const noButton = document.querySelector('.js-confirm-no');

    if(noButton)
    {
      noButton.addEventListener('click',() => {

        confirmButton.style.display = "None";

      });
    }

    const yesButton = document.querySelector('.js-confirm-yes');

    if(yesButton)
    {
      yesButton.addEventListener('click', () => {

        window.location.href = "index.html";

      });
    }

  });
}

const r = document.querySelector('.js-receipt');

if(r)
{
  r.addEventListener('click', () => {

    const url = new URL(window.location.href);
    const id = url.searchParams.get('userid');

    window.location.href = `receipt.html?userid=${id}`;

  });
}

const st = document.querySelector('.js-stock');

if(st)
{
  st.addEventListener('click', () => {

    const url = new URL(window.location.href);
    const id = url.searchParams.get('userid');

    window.location.href = `stock.html?userid=${id}`;

  });
}