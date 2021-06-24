'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Alonso Báez',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 2014,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-06-16T17:01:17.194Z',
    '2021-06-19T23:36:17.929Z',
    '2021-06-20T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'es-ES', // de-DE
};

const account2 = {
  owner: 'Marvin Báez',
  movements: [
    5000, 3400, -150, -790, -3210, -1000, 8500, -30, 3000, 3000, 3500, 4780,
    8500, 7000,
  ],
  interestRate: 1.5,
  pin: 2525,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
    '2021-06-16T12:01:21.894Z',
    '2021-06-18T12:02:22.894Z',
    '2021-06-20T12:03:23.894Z',
    '2021-06-20T12:04:24.894Z',
    '2021-06-21T12:05:25.894Z',
    '2021-06-21T12:06:26.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const formatMovementsDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
  // else {
  //   const day = `${date.getDate()}`.padStart(2, 0);
  //   const month = `${date.getMonth() + 1}`.padStart(2, 0);
  //   const year = date.getFullYear();
  //   return `${month}/${day}/${year}`;
  // }
};

/*
Note: About formatMovementsDate function: 
* calcDaysPassed: Esta función calcula la cantidad de días transcurridos entre dos fechas.

* daysPassed: Esta función es una parte complementaria de la función 'calcDaysPassed'. Esta pasa en limpio la cantidad de días transcurridos entre dos fechas calculadas previamente en la función 'calcDaysPassed'.

* Condicionales if: Indican el valor a retornar según la lógica establecida, basándose en las condiciones evaluadas con la función 'daysPassed'.

* Condiciona else: En caso de no cumplirse ningunas de las condicionales if, retornará el formato de fecha indicado en el template literal seguido del 'return' keyword.


*/

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]); // Note: esta variable coloca las fechas de movimientos a cada transacción.
    const displayDate = formatMovementsDate(date, acc.locale); // Note: Esta variable retorna la fecha de los movimientos de acuerdo a los formatos establecidos en las condicionales dentro de la función 'formatMovementsDate'. Y también retorna la fecha del idioma 'locale' de la cuenta de los usuarios.

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds is reached, stop tomer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time = 500;

  // Call the timer every second
  tick(); // Note: This is how we call this function inmediately
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

///////////////////////////////////////
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Setting the current date and hour to balance label:
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: '2-digit',
      year: 'numeric',
      // weekday: 'long',
    };

    // const locale = navigator.language; // Note: Esta propiedad toma el idioma que esté configurado en el navegador que esté usando el usuario.
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${month}/${day}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// Topic Converting and Checking Numbers

// Base 10 - 0 to 9. 1/10 = 0.1 3/10 = 3.
// Binary base 2 - 0 1
console.log(0.1 + 0.2);

// Conversion
console.log(Number('23'));
console.log(+'23'); // The + sign works the same as the Number method.

// Parsing
console.log(Number.parseInt('30px', 10)); // Funciona para extraer un número de un texto, siempre y cuando empiece con número. El segundo parámetro se refiere a Regex(expresión regular), las expresiones regulares son patrones que se utilizan para hacer coincidir combinaciones de caracteres en cadenas.
console.log(Number.parseInt('e23', 10));

console.log(Number.parseInt('  2.5rem  ')); // parseInt funciona solo para números enteros. Si se utiliza en números con decimales, retornará la parte entera solamente.
console.log(Number.parseFloat('  2.5rem  ')); // parseFloat si funciona para extraer enteros con decimales de un string.

// Check if value is NaN
// .isNaN funciona para saber si un valor es NaN.
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(23 / 0));

// Checking if value is number
// Este método es el que mejor funciona para comprobar si un valor es número.
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20X'));
console.log(Number.isFinite(23 / 0));

// Check if a number is an integer
console.log(Number.isInteger(23));
console.log(Number.isInteger(23));
console.log(Number.isInteger(23 / 0));

// Topic Math and Rounding

console.log(Math.sqrt(25)); // Square root (Raíz cuadrada)
console.log(25 ** (1 / 2)); // Forma mamual de hacer la raíz cuadrada
console.log(8 ** (1 / 3)); // Cubic root (Raíz cúbica), según Jonas, esta es la única forma de hacerlo en JS porque no hay un método para esta operación.

console.log(Math.max(5, 23, 45, 6, 7, 8, 2)); // Searching for maximum value in a range of value and returning it.
console.log(Math.max(5, 23, '45', 6, 7, 8, 2)); // Si un número está en string, lo convierte a número (coercing).
console.log(Math.max(5, 23, '45px', 6, 7, 8, 2)); // En este caso retorna 'NaN'.

console.log(Math.min(5, 23, 45, 6, 7, 8, 2)); // Searching for minimum value in a range of value and returning it.

console.log(Math.PI); // Pi value (3.14)

console.log(Math.PI * Number.parseFloat('10px') ** 2); // Esta formula calcula el área de un circulo con el radio especificado en el método parseFloat.

// Creating a random number with a minimum and a maximun value.
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;

console.log(randomInt(6, 10));

// Rounding Integers

// Math.trunc - This deletes any decimal of an integer.
console.log(Math.trunc(23.3));

// Math.round - This rounds to the nearest integer.
console.log(Math.round(23.3));
console.log(Math.round(23.9));

// Math.ceil - This round up to the next integer.
console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

// Math.floor - This round down to the integer it is.
console.log(Math.floor(23.3));
console.log(Math.floor(23.9));

// Rounding decimals
// .toFixed() va precedido por el número o variable a la que será redondeada y entre paréntesis se coloca la cantidad de fracciones que se desea. Note: Cuando hace el retorno, lo hace en tipo string, por lo que hay que convertirlo en número.
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(0));
console.log(+(2.2345).toFixed(0));

// Topic The Remainder Operator
console.log(5 % 2);
console.log(5 % 2); // 5 = 2 * 2 + 1

console.log(8 % 3);
console.log(8 / 3); // 8 = 2 * 3 + 2

console.log(6 % 2);
console.log(6 / 2);

console.log(7 % 2);
console.log(7 / 2);

const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));

// Note: This formula is important to know if a number is divisible with others.

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = '#F5E6CA';
    if (i % 3 === 0) row.style.backgroundColor = '#FFF5B7';
  });
});

// Topic Creating Dates:
/*
const now = new Date();
console.log(now);

console.log(new Date('Sun Jun 20 2021 19:16:32'));
console.log(new Date('December 24, 2015'));
console.log(new Date(account2.movementsDates[0]));

console.log(new Date(1978, 9, 25, 13, 30, 7));
console.log(new Date(2014, 9, 7));

console.log(new Date(0));
console.log(new Date(3219 * 24 * 60 * 60 * 1000));
*/

// Working with dates
const future = new Date(2022, 9, 25, 13, 30);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime());

console.log(new Date(1666697400000));

console.log(Date.now());

future.setFullYear(2040);
console.log(future);

// Topic Operations with dates
console.log(+future); // Note: The + sign converts the variable into a number
/*
const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24); // Note: Para calcular la cantidad de días entre dos fechas se utilizan los siguientes números que representan los datos: 1000 = milliseconds, 60 = seconds, 60 = minutes, 24 = hours. Todos estos números multiplicados por las fechas en el formato timestamp de JS. El método Math.abs fue utilizado aquí porque se calculó una fecha menor - menos una fecha mayor que dio como resultado un número negativo.

const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));

console.log(days1);

// Note: Para conseguir una fecha convertida a timestamp se usa el método 'new Date()'.
*/

// Topic Internationalization Numbers (Intl)
/*
const num = 31654665.14;

const options = {
  style: 'currency', // Options for style: currency, percent, unit
  unit: 'celsius',
  currency: 'EUR',
};

console.log('US: ', new Intl.NumberFormat('en-US', options.unit).format(num)); // Note: En el API Intl.NumberFormat se indica el idioma y país en base al cual será formateado el número, que se encuentra dentro del método'.format()'.
console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(num));
console.log('Japan: ', new Intl.NumberFormat('ja-JA', options).format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language).format(num)
);
*/

// Topic Timers: setTimeout and setInterval
//Example: setTimeout

setTimeout(
  (ing1, ing2) =>
    console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕 `),
  3000,
  'olives',
  'spinach'
);
console.log('Waiting...');

// Note: El tiempo de temporizador debe ser especificado en milisegundos. Esta función acepta argumentos que pueden ir acompañado de un string. El temporizador puede durar un poco más del tiempo establecido.

// Note: También se puede detener el temporizador antes de que el tiempo establecido concluya con el método 'clearTimeout'.

// Example

const ingredients = ['pesto', 'chorizo'];
const pizzaTimer = setTimeout(
  (ing1, ing2) =>
    console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕 `),
  3000,
  ...ingredients
);

console.log('Waiting...');

if (ingredients.includes('chorizo')) clearTimeout(pizzaTimer);

// setInterval
// Example
/*
setInterval(function() {
  const now = new Date();
  console.log(now);}, 1000
);
*/
