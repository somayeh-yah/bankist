"use strict";

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
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

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function (movements, sort = false) {
 
  containerMovements.innerHTML = " ";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const movementHtml = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    }${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
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

  containerCreateCard.innerHTML = modalBox;
  
  document.querySelector(".close-modal").addEventListener("click", function () {
    containerCreateCard.innerHTML = " ";
   
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

const errorMessage = (message) => {
  const errMessage = `<p class= "err__message" > ${message}</P>`;
   errorElement.classList.remove("hidden");
  errorElement.innerHTML = errMessage;
  document.querySelector(".err__message").addEventListener("click", function () {
    errorElement.innerHTML = " ";
   
  });
 
};

const createUserInitials = function (acca) {
  acca.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((username) => username[0])
      .join("");
  });
};

console.log(createUserInitials(accounts));
console.log(accounts);
let currentInlogedUser;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  
 currentInlogedUser = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (!currentInlogedUser) {
  
    errorMessage(["Invalid username"]);
  } else if (currentInlogedUser.pin !== Number(inputLoginPin.value)) {
  
    errorMessage(["Invalid PIN"]);
  }else {
    errorElement.textContent = " ";
    currentInlogedUser?.pin === Number(inputLoginPin.value);
    labelWelcome.textContent = `Welcome back: ${
      currentInlogedUser.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    
    
  
    updateUI(currentInlogedUser);
  } 
 

 
});

const updateUI = (account) => {
  displayMovements(account.movements);
  calcBalance(account);
  displaySummaryIn(account);
  displaySummeryOut(account);
  displaySummeryInterest(account);
};

btnTransfer.addEventListener("click", function (e) {
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

  
    updateUI(currentInlogedUser);
  }
});


btnClose.addEventListener("click", function (e) {
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

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentInlogedUser.movements.some((mov) => mov >= amount * 0.1)
  ) {
    
    currentInlogedUser.movements.push(amount);
 
    updateUI(currentInlogedUser);
  }
  inputLoanAmount.value = " ";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentInlogedUser.movements, !sorted);
  sorted = !sorted; 
});
