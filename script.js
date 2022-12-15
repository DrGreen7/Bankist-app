"use strict";
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

//selecting the DOM elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movement");

const btnLogin = document.querySelector(".login__btn");
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

// adding functionality
const displayMovements = function (movements, sorting = false) {
  let movs = sorting ? movements.slice().sort((a, b) => a - b) : movements;
  containerMovements.innerHTML = "";

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
      <div class="movement__row">
        <div class="movement__type movement__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movement__value">${mov}€</div>
     </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const displayCalcBalance = function (account) {
  account.balance = account.movements.reduce((sValue, mov) => sValue + mov, 0);
  labelBalance.textContent = `${account.balance}€`;
};

const displayCalcSummary = function (account) {
  const income = account.movements
    .filter((mov) => mov > 0)
    .reduce((sValue, mov) => sValue + mov, 0);
  labelSumIn.textContent = `${income}€`;
  const outcome = account.movements
    .filter((mov) => mov < 0)
    .reduce((sValue, mov) => sValue + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;
  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * account.interestRate) / 100)
    .filter((mov) => mov >= 1)
    .reduce((sValue, mov) => sValue + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
};
createUserName(accounts);

const updateUI = function (account) {
  displayMovements(account.movements);
  displayCalcBalance(account);
  displayCalcSummary(account);
};

let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  let currentUserName = inputLoginUsername.value;
  currentAccount = accounts.find(
    (account) => account.userName === currentUserName
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = "100";
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receivingAccount = accounts.find(
    (account) => account.userName === inputTransferTo.value
  );
  console.log(amount, receivingAccount);
  //conditions to allow the transfer
  //receiving account should be valid
  //the amount should be positive means more than zero
  //the sending current account should have balance to transfer that money
  //the username should not be the current account account username
  if (
    amount > 0 &&
    receivingAccount &&
    amount <= currentAccount.balance &&
    currentAccount.userName !== inputTransferTo.value
  ) {
    currentAccount.movements.push(-amount);
    receivingAccount.movements.push(amount);
    inputTransferAmount.value = inputTransferTo.value = "";
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  let amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((deposit) => deposit >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (account) => account.userName === currentAccount.userName
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

let sorting = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorting);
  sorting = !sorting;
});
