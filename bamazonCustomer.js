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

//Displays all products and all product info
connection.query("SELECT * FROM products", function(err, res) {
  // for (var i = 0; i < res.length; i++) {
  //   console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + " | " + res[i].product_sales);
  // }
  console.table(res);
  console.log("-----------------------------------");

  var x = res;

  //Load inquirer and ask two questions - 1)ID of desired item, and 2)How many units desired.
  //If there is adequate supply to fill the order, the user "purchases" those items and is given their total cost.
  //If there isn't adequate supply to fill the order, the user is informed.
	inquirer.prompt([{
	    name: "ID",
	    type: "input",
	    message: "What is the ID of the item you would like to purchase?"
	}, {
	    name: "desiredUnits",
	    type: "input",
	    message: "How many of that item would you like to purchase?"
	}]).then(function(answer) {
		var y = answer.desiredUnits;
		var z = x[answer.ID -1].stock_quantity;
	    if (y <= z) {
	    	connection.query("SELECT * FROM products", function(err, res) {
          for (var i = 0; i < res.length; i++) {
            if (res[i].id === parseInt(answer.ID)) {
              var zz = res[i].product_sales;
            }
          }
          connection.query("UPDATE products SET ? WHERE ?", [{
            stock_quantity: z - y,
            product_sales: zz + (answer.desiredUnits * x[answer.ID - 1].price)
          }, {
            id: answer.ID
          }], function(err, res) {
            console.log("Total price of your order: " + (answer.desiredUnits * x[answer.ID - 1].price));
            //  * Add the revenue from each transaction to the `total_sales` column for the related department.
            connection.query("SELECT * FROM departments", function(err, res) {
              for (var i = 0; i < res.length; i++) {
                if (x[answer.ID - 1].department_name === res[i].department_name) {
                  var yy = res[i].department_name;
                  var zz = res[i].total_sales;
                  connection.query("UPDATE departments SET ? WHERE ?", [{
                    total_sales: zz + (answer.desiredUnits * x[answer.ID - 1].price)
                  }, {
                    department_name: yy
                  }], function(err, res) {
                    console.log("Total sales updated");
                  });
                }
              }
            })
          });
        })
	    }
	    else if (y > z) {
	    	console.log("Insufficient quantity!");
	    }
	});
});



