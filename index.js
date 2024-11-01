"use strict";

/////////////////////////////////////////////////
// BANKIST APP

// User Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const errorElement = document.getElementById("error__message__container");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const containerCreateCard = document.querySelector("#create_modal_container");
const cardContainer = document.querySelector(".card_container");
const overlay = document.getElementById("overlay");

const btnLogin = document.querySelector(".login__btn");
const btnCreate = document.querySelector(".create__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const createUserInitials = (acca) => {
  acca.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((username) => username[0])
      .join("");
  });
};

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = " ";

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(account.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    const displayDate = `${day}.${month}.${year}`;
    const movementHtml = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    }${type}</div>
        
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", movementHtml);
    console.log(movementHtml);
  });
};

btnCreate.addEventListener("click", function () {
  const modalBox = `
    <div class="modal">
      <div class="modal-content">
    
        <button class="close-modal">&times;</button>
        <form id="bank-card-form">
          
          <label class="label-modal" for="card-number">Card Number</label>
          <input type="text" class="input-modal" id="card-number" name="card-number" required >
          
          <label class="label-modal" for="expiry-date">Expiry Date</label>
          <input type="date" id="expiry-date" class="input-modal" name="expiry-date" required>
          
          <label class="label-modal" for="cvv">CVV</label>
          <input type="text" id="cvv" class="input-modal"  name="cvv" required>
          
          <button class= "btn_submit"  type="submit">Submit</button>
        </form>
      </div>
    </div >
  `;
  containerCreateCard.classList.remove("hidden");
  overlay.classList.remove("hidden");
  containerCreateCard.innerHTML = modalBox;

  document.querySelector(".close-modal").addEventListener("click", function () {
    containerCreateCard.classList.add("hidden");
    overlay.classList.add("hidden");
  });
});

const calcBalance = (account) => {
  account.balance = account.movements.reduce((acc, curMov) => acc + curMov, 0);

  labelBalance.textContent = `${account.balance}€`;
};

const displaySummaryIn = (account) => {
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${incomes}€`;
};

const displaySummeryOut = (account) => {
  const out = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;
};

const displaySummeryInterest = (account) => {
  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * account.interestRate) / 100)
    .filter((inte, i, arr) => {
      console.log(arr);
      return inte > 1;
    })
    .reduce((acc, inte) => acc + inte, 0);
  labelSumInterest.textContent = `${interest}`;
};

const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");
  errorDisplay.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");
  errorDisplay.innerText = " ";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};

const validateInputs = () => {
  const usernameValue = inputLoginUsername.value.trim();
  const userPinValue = inputLoginPin.value.trim();

  if (usernameValue === "") {
    setError(inputLoginUsername, "Username is required.");
  } else {
    setSuccess(inputLoginUsername);
  }

  if (userPinValue === "") {
    setError(inputLoginPin, "Password is required.");
  } else if (userPinValue.length < 4) {
    setError(inputLoginPin, "Password must be 4 charachter.");
  } else {
    setSuccess(inputLoginPin);
  }
};

console.log(createUserInitials(accounts));
console.log(accounts);
let currentInlogedUser;

const updateUI = (account) => {
  displayMovements(account);
  calcBalance(account);
  displaySummaryIn(account);
  displaySummeryOut(account);
  displaySummeryInterest(account);
};

currentInlogedUser = account1;
updateUI(currentInlogedUser);
containerApp.style.opacity = 100;

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  validateInputs();
  const isUsernameValid =
    inputLoginUsername.parentElement.classList.contains("success");
  const isPinValid = inputLoginPin.parentElement.classList.contains("success");

  if (!isUsernameValid || !isPinValid) {
    return;
  }

  currentInlogedUser = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  currentInlogedUser?.pin === Number(inputLoginPin.value);
  labelWelcome.textContent = `Welcome back: ${
    currentInlogedUser.owner.split(" ")[0]
  }`;

  containerApp.style.opacity = 100;

  //Create current date and time
  const dateNow = new Date();
  const day = `${dateNow.getDate()}`.padStart(2, 0);
  const month = `${dateNow.getMonth() + 1}`.padStart(2, 0);
  const year = dateNow.getFullYear();
  const hour = `${dateNow.getHours()}`.padStart(2, 0);
  const min = `${dateNow.getMinutes()}`.padStart(2, 0);
  labelDate.textContent = `${day}-${month}-${year}, ${hour}:${min}`;
  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginUsername.style.border = inputLoginPin.style.border = "none";
  inputLoginPin.blur();

  updateUI(currentInlogedUser);
});

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferTo.value = inputTransferAmount.value = " ";

  if (
    amount > 0 &&
    reciverAcc &&
    currentInlogedUser.balance >= amount &&
    reciverAcc?.username !== currentInlogedUser.username
  ) {
    currentInlogedUser.movements.push(-amount);
    reciverAcc.movements.push(amount);
    
    currentInlogedUser.movementsDates.push(new Date().toISOString());
    reciverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentInlogedUser);
  }
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentInlogedUser.username &&
    Number(inputClosePin.value) === currentInlogedUser.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentInlogedUser.username
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = " ";
});

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentInlogedUser.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentInlogedUser.movements.push(amount);
    currentInlogedUser.movementsDates.push(new Date().toISOString());
   

    updateUI(currentInlogedUser);
  }
  inputLoanAmount.value = " ";
});

let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentInlogedUser.movements, !sorted);
  sorted = !sorted;
});
