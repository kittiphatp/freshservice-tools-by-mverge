// Initial get components: domain, username, password
let domain = document.querySelector('#domain');
let username = document.querySelector('#username');
let pwd = document.querySelector('#pwd');

// Intial get component: main section and set display to none
let main = document.querySelector('main');
main.style.display = 'none';

// Event Listner change on Hero section
domain.addEventListener('change', () => CheckInputHero());
username.addEventListener('change', () => CheckInputHero());
pwd.addEventListener('change', () => CheckInputHero());

// Initial get components: actorname, startid, stopid, textarea, btnsubmit, btnclear
let actorName = document.querySelector('#actorname').value;
let txtActorName = document.querySelector('#actorname');
let txtStartId = document.querySelector('#startid');
let txtStopId = document.querySelector('#stopid');
let textArea = document.querySelector('textarea');
const btnSubmit = document.querySelector('#btnsubmit');
const btnClear = document.querySelector('#btnclear');

let startId = txtStartId.value;
let stopId = txtStopId.value;

let numTicketFind = document.querySelector('#numticketfind');
let numTicketOutput = document.querySelector('#numberticketoutput');

// user full name to find
// const actorName = 'Woraban Suphisa';
// const actorName = 'Chuntima Chayakettarin';

// ticket array
let ticketArr = new Array();

// button submit to get data with fetch api
btnSubmit.addEventListener('click', async () => {
  // disable button to click
  ToggleMainBtnComponents(false);
  // disable input
  ToggleMainInputComponents(false);

  // clear ticket array
  ticketArr = [];

  actorName = document.querySelector('#actorname').value;
  startId = document.querySelector('#startid').value;
  stopId = document.querySelector('#stopid').value;
  textArea = document.querySelector('textarea');

  startId = Number(startId);
  stopId = Number(stopId);

  // calculate number of ticket to find
  numTicketFind.textContent = stopId - startId + 1;
  numTicketOutput.textContent = 'process...';
  textArea.value = '';

  // find the actor_name
  // console.log('waiting....');
  for (let i = startId; i <= stopId; i++) {
    numTicketOutput.textContent = `checking...${i}`;
    let user = await getData(i, actorName);
    let checkUser = (await user) === undefined ? 'No' : 'Yes';
    // await console.log(user);
    // await console.log(checkUser);
    if (checkUser === 'Yes') {
      ticketArr.push(i);
    }
    await timer(100);
  }
  // console.log(ticketArr);

  numTicketOutput.textContent = await ticketArr.length;

  // Order ticket number and update value at text area component
  const ticketArrOrder = await OrderTicketId(ticketArr);
  textArea.value = ticketArrOrder;

  // Enable button to click
  ToggleMainBtnComponents(true);
  // Enable input
  ToggleMainInputComponents(true);
});

// button clear all input at main section
btnClear.addEventListener('click', () => {
  document.querySelector('#actorname').value = '';
  document.querySelector('#startid').value = null;
  document.querySelector('#stopid').value = null;
  document.querySelector('textarea').value = '';
  numTicketFind.textContent = '';
  numTicketOutput.textContent = '';
  ticketArr = [];

  // Enable input
  ToggleMainInputComponents(true);
});

// validate start id and stop id
txtStartId.addEventListener('change', () => ValidationStartStopId());
txtStopId.addEventListener('change', () => ValidationStartStopId());

// function delay
const timer = (ms) => new Promise((res) => setTimeout(res, ms));

// function validation of start id and stop id input
function ValidationStartStopId() {
  // get start id and stop id
  startId = document.querySelector('#startid').value;
  stopId = document.querySelector('#stopid').value;

  // check stop id more than start id
  if (stopId - startId <= 0) {
    btnSubmit.disabled = true;
    btnSubmit.style.backgroundColor = 'lightgray';
  } else {
    btnSubmit.disabled = false;
    btnSubmit.style.backgroundColor = 'rgba(173, 255, 47, 0.4)';
  }
}

// function order ticket id
function OrderTicketId(ticketArr) {
  let ticketArrOrder = ticketArr.sort();
  return ticketArrOrder;
}

// function get values from components
function UpdateComponent() {
  let updatedComponentObject = {
    domainValue: document.querySelector('#domain').value,
    usernameValue: document.querySelector('#username').value,
    pwdValue: document.querySelector('#pwd').value,
    main: document.querySelector('main'),
  };

  return updatedComponentObject;
}

// function check input box at hero section
function CheckInputHero() {
  // run function to update components
  let updatedComponentObject = UpdateComponent();

  // show main section
  if (
    updatedComponentObject.domainValue !== '' &&
    updatedComponentObject.usernameValue !== '' &&
    updatedComponentObject.pwdValue !== ''
  ) {
    updatedComponentObject.main.style.display = 'flex';
  } else {
    updatedComponentObject.main.style.display = 'none';
  }
}

// function disable input components at main section
function ToggleMainInputComponents(boolean) {
  // Disable input
  txtStartId.disabled = !boolean;
  txtStopId.disabled = !boolean;
  txtActorName.disabled = !boolean;
}

// function enable button components at main section
function ToggleMainBtnComponents(boolean) {
  btnSubmit.disabled = !boolean;
  btnClear.disabled = !boolean;

  // change color if disable
  if (!boolean) {
    btnSubmit.style.backgroundColor = 'lightgray';
    btnClear.style.backgroundColor = 'lightgray';
  } else {
    btnSubmit.style.backgroundColor = 'rgba(173, 255, 47, 0.4)';
    btnClear.style.backgroundColor = 'rgba(255, 47, 106, 0.4)';
  }
}

// function fetch data from api
async function getData(id, name) {
  // run function to update components
  let updatedComponentObject = UpdateComponent();

  // encode username and password
  let encodeData = window.btoa(
    `${updatedComponentObject.usernameValue}:${updatedComponentObject.pwdValue}`
  );

  // define url
  const url = `https://${updatedComponentObject.domainValue}.freshservice.com/api/v2/tickets/${id}/activities`;

  // fetch api
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: 'Basic OGo0NEE5M0JUWlRsakt0YmY4dmg6WA==', // RCL
      Authorization: `Basic ${encodeData}`, // RCL
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  })
    .then((data) => data.json())
    .then((activity) => activity.activities)
    .catch((err) => {
      textArea.value = err;

      // Enable button to click
      ToggleMainBtnComponents(true);
      // Disable input
      ToggleMainInputComponents(false);
    });

  let user = await response.find((item) => item.actor.name === name);
  return user;
}
