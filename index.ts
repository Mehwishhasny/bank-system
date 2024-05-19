#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import { faker } from "@faker-js/faker";

class CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  age: number;
  accNumber: number;
  gender: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    phone: number,
    age: number,
    accNumber: number,
    gender: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.age = age;
    this.accNumber = accNumber;
    this.gender = gender;
  }
}

interface BankAccount {
  accNumber: number;
  balance: number;
}

class BankAccountData {
  customer: CustomerData[] = [];
  account: BankAccount[] = [];

  addCustomer(object: CustomerData) {
    this.customer.push(object);
  }

  addAccount(object: BankAccount) {
    this.account.push(object);
  }

  transaction(accObject: BankAccount){
    let NewAccounts = this.account.filter(acc => acc.accNumber !== accObject.accNumber);
    this.account = [...NewAccounts, accObject];
  }
}

let myBank = new BankAccountData();
/*let client = new CustomerData("Mehwish", "Zeeshan", "xyz.hotmail.com", 2345777, 31, 4455, "Female");

console.log(client);
*/

for (let i = 1; i <= 10; i++) {
  let fName = faker.person.firstName("female");
  let lName = faker.person.lastName();
  let email = faker.internet.email();
  let num = parseInt(faker.string.numeric("###########"));

  const client = new CustomerData(
    fName,
    lName,
    email,
    num,
    18 + i,
    10000 + i,
    "female"
  );
  myBank.addCustomer(client);
  myBank.addAccount({ accNumber: client.accNumber, balance: 1000 * i });
}

//Bank function
async function bankSystem(bank: BankAccountData) {
  let service = await inquirer.prompt({
    type: "list",
    name: "selection",
    message: "Please select the service",
    choices: ["View Balance", "Cash Deposit", "Cash Withdrawl"],
  });
  if (service.selection == "View Balance") {
    let response = await inquirer.prompt({
      type: "input",
      name: "number",
      message: "Please enter your account number:",
    });
    let acc = myBank.account.find((acc) => acc.accNumber == response.number);
    if (!acc) {
      console.log(chalk.red.bold("Invalid account number"));
    }
    if (acc) {
      let name = myBank.customer.find((item) => item.accNumber == acc?.accNumber);
      console.log(chalk.green.bold(`Dear ${(name?.firstName)} ${(name?.lastName)}, your balance is ${chalk.blue("$",acc.balance)}.`));
    }
  }

  if (service.selection == "Cash Deposit") {
    let response = await inquirer.prompt({
        type: "input",
        name: "number",
        message: "Please enter your account number:",
      });
      let acc = myBank.account.find((acc) => acc.accNumber == response.number);
      if (!acc) {
        console.log(chalk.red.bold("Invalid account number"));
      }
      if (acc) {
          let ans = await inquirer.prompt({
              type: "number",
              name: "rupeees",
              message: "Please enter your amount:"
          });
          let newBalance = acc.balance + ans.rupeees;
          bank.transaction({accNumber: acc.accNumber, balance: newBalance});
          let name = myBank.customer.find((item) => item.accNumber == acc?.accNumber);

          console.log(chalk.green.bold(`Dear ${(name?.firstName)} ${(name?.lastName)}, you deposit ${chalk.yellow("$",ans.rupeees)} and your balance is ${chalk.blue("$",newBalance)}.`));
  
      }

  }
  if (service.selection == "Cash Withdrawl") {
    let response = await inquirer.prompt({
      type: "input",
      name: "number",
      message: "Please enter your account number:",
    });
    let acc = myBank.account.find((acc) => acc.accNumber == response.number);
    if (!acc) {
      console.log(chalk.red.bold("Invalid account number"));
    }
    if (acc) {
        let ans = await inquirer.prompt({
            type: "number",
            name: "rupeees",
            message: "Please enter your amount:"
        });
        if(ans.rupeees > acc.balance){
          console.log(chalk.red.bold("Insufficient Balance"));
          return;
        }
        let newBalance = acc.balance - ans.rupeees;
        bank.transaction({accNumber: acc.accNumber, balance: newBalance});
        let name = myBank.customer.find((item) => item.accNumber == acc?.accNumber);

        console.log(chalk.green.bold(`Dear ${(name?.firstName)} ${(name?.lastName)}, you withdraw ${chalk.yellow("$",ans.rupeees)} and your balance is ${chalk.blue("$",newBalance)}.`));

    }
  }
}

bankSystem(myBank);
