var inquirer = require('inquirer');
var mysql = require('mysql');
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "Bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
});

//Get manager's menu selection
inquirer.prompt([{
    name: "menuOption",
    type: "list",
    message: "What would you like to do, today?",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"] 
}]).then(function(answer) {

	//If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
	if (answer.menuOption === "View Products for Sale") {
		console.log("Selected option 1");
		connection.query("SELECT * FROM products", function(err, res) {
		  // for (var i = 0; i < res.length; i++) {
		  //   console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
		  // }
		  console.table(res);
		  console.log("-----------------------------------");
		})
	}

	// If a manager selects `View Low Inventory`, then it should list all items with a inventory count lower than five.
	else if (answer.menuOption === "View Low Inventory") {
		console.log("Selected option 2");
		connection.query("SELECT * FROM products", function(err, res) {
		  for (var i = 0; i < res.length; i++) {
		  	if (res[i].stock_quantity < 5) {
		    	console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
		  	}
		  }
		  console.log("Low inventory items listed above.");
		  console.log("-----------------------------------");
		})
	}

	// If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
	else if (answer.menuOption === "Add to Inventory") {
		console.log("Selected option 3");
		inquirer.prompt([{
		    name: "ID",
		    type: "input",
		    message: "What is the ID of the item you would like to modify?"
		}, {
		    name: "unitsToAdd",
		    type: "input",
		    message: "How many of that item would you like to add?"
		}]).then(function(answer) {
			var y = parseInt(answer.unitsToAdd);
			var z = 0;

			connection.query("SELECT * FROM products", function(err, res) {
			  for (var i = 0; i < res.length; i++) {
			  	if (res[i].id === parseInt(answer.ID)) {
			    z = res[i].stock_quantity;
			    console.log(z);
			  	}
			  }
			  connection.query("UPDATE products SET ? WHERE ?", [{
		            stock_quantity: z + y
		        }, {
		            id: answer.ID
		        }], function(err, res) {
		            console.log("Items added successfully!");
		            console.log(z + y);
		        });
			})		
		});
	}
	
	//If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
	else if (answer.menuOption === "Add New Product") {
		console.log("Selected option 4");
			inquirer.prompt([{
		    name: "product_name",
		    type: "input",
		    message: "What is the name of the product you'd like to add?"
		}, {
		    name: "department_name",
		    type: "input",
		    message: "In which department will this item be placed?"
		}, {
		    name: "price",
		    type: "input",
		    message: "How much does one of these cost?"
		}, {
		    name: "stock_quantity",
		    type: "input",
		    message: "How many of these are in stock?"
		}]).then(function(answer) {
			connection.query("INSERT INTO products SET ?", {
		      product_name: answer.product_name,
		      department_name: answer.department_name,
		      price: answer.price,
		      stock_quantity: answer.stock_quantity
		    }, function(err, res) {
		      console.log("Your item was created successfully!");
		    });
		});
	}
});	