let Users = [];
// [{
//   id: 1,
//   username: 'Soban',
//   password: '1234'
// }];

async function loadUsers()
{
  const res = await fetch('/users');
  Users = await res.json();
}

await loadUsers();

function checkData()
{
  const loginbt = document.querySelector('.js-login');
  let isCorrect = false;

  if(loginbt)
  {
    loginbt.addEventListener('click', () => {

      const name = document.querySelector('.js-username').value;
      const pass = document.querySelector('.js-password').value;

      Users.forEach((user) => {

        if(user.username == name && user.password == pass)
        {
          isCorrect = true;
          window.location.href = `home.html?userid=${user.id}`;
        }

      });

      if(isCorrect === false)
      {
        if(name==='' || pass==='')
        {
          if(document.querySelector('.js-Empty')) {

            document.querySelector('.js-Empty').style.display = "Flex";

            setTimeout(() => {
              document.querySelector('.js-Empty').style.display = "None";
            },2000);
          }
        }
        else {
          if(document.querySelector('.js-Wrong'))
          {
            document.querySelector('.js-Wrong').style.display = "Flex";
          }

          setTimeout(() => {
              document.querySelector('.js-Wrong').style.display = "None";
          },2000);
        }
      }

    });
  }
}

checkData();

