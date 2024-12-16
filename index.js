import { readFileSync, writeFileSync, existsSync } from 'fs';

let expenseList = {
    expenses: []
}

const addUsage = 'node index.js add --description <string> --amount <number>';
const listUsage = 'node index.js list';
const deleteUsage = 'node index.js delete --id 2';
const summaryUsage = 'node index.js summary --month 8';

if (process.argv.length < 3 && process.argv.length > 7) {
    console.trace('Invalid program arguments');
    process.exit(1);
}
if (!existsSync('expenses.json')) {
    writeFileSync('expenses.json', JSON.stringify((expenseList)), undefined, 4);
}

let action = process.argv[2];
let expensesJson = JSON.parse(readFileSync('expenses.json'));
if (action === 'add') {
    if (process.argv[7] !== undefined) {
        console.trace('No further argument is required given an amount');
        console.log('Example:\n' + addUsage);
        process.exit(1);
    }
    if (process.argv[3] !== '--description') {
        console.trace("Enter the 'description' flag, --description");
        console.log('Example:\n' + addUsage);
        process.exit(1);
    }
    if (process.argv[5] !== '--amount') {
        console.trace("Enter the 'amount' flag, --amount");
        console.log('Example:\n' + addUsage);
        process.exit(1);
    }

    const newExpense = {
        id: expensesJson.expenses.length,
        date: Date.now(),
        description: process.argv[4],
        amount: process.argv[6]
    }
    expensesJson.expenses.forEach((expense) => expenseList.expenses.push(expense));
    expenseList.expenses.push(newExpense);
    writeFileSync('expenses.json', JSON.stringify(expenseList, undefined, 4));
    console.log(`Expense added successfully (ID: ${newExpense.id})`);
} else if (action === 'list') {
    if (process.argv[3] !== undefined) {
        console.trace('No further argument is required given an action');
        console.log('Example:\n' + listUsage);
        process.exit(1);
    }
    console.log(`ID\tDate\t\t\tDescription\t\tAmount`);
    expensesJson.expenses.forEach((expense) =>
        console.log(`${expense.id}\t${new Date(expense.date).toLocaleDateString()}\t\t${expense.description}\t\t\t${expense.amount}`));
} else if (action === 'summary') {
    let totalExpenses = 0;
    if (process.argv[3] !== undefined) {
        if (process.argv[5] !== undefined) {
            console.trace('No further argument is required given a month');
            console.log('Example\n' + summaryUsage);
            process.exit(1);
        }
        if (process.argv[3] !== '--month') {
            console.trace("Enter the 'month' flag, --month");
            console.log('Example:\n' + summaryUsage);
            process.exit(1);
        }
        let monthNumber = process.argv[4];
        expensesJson.expenses.forEach((expense) => {
            let monthOfExpense = new Date(expense.date).getMonth()+1;
            if (monthOfExpense == monthNumber) {
                totalExpenses += parseInt(expense.amount);
            }
        });
        console.log(`Total expenses: $${totalExpenses}`);
    } else {
        expensesJson.expenses.forEach((expense) => totalExpenses += parseInt(expense.amount));
        console.log(`Total expenses: $${totalExpenses}`);
    }
} else if (action === 'delete') {
    if (process.argv[5] !== undefined) {
        console.trace('No further argument is required given an ID');
        console.log('Example:\n' + deleteUsage);
        process.exit(1);
    }
    if (process.argv[3] !== '--id') {
        console.trace("Enter the 'id' flag, --id");
        console.log('Example:\n' + deleteUsage);
        process.exit(1);
    }

    expensesJson.expenses.forEach((expense) => {
        if (expense.id !== parseInt(process.argv[4])) {
            expenseList.expenses.push(expense);
        }
    });
    writeFileSync('expenses.json', JSON.stringify(expenseList, undefined, 4));
    console.log('Expense deleted successfully');
}
