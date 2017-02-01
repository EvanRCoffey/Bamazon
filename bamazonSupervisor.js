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

//Get supervisor's menu selection
inquirer.prompt([{
    name: "menuOption",
    type: "list",
    message: "What would you like to do, today?",
    choices: ["View All Departments", "Create New Department"] 
}]).then(function(answer) {

	//  THE ONLY THING LEFT TO DO IS MAKE YOUR TABLE DATA LOOK PRETTY
	//  FOR REFERENCE, THIS IS WHAT IT SHOULD LOOK LIKE:
	//
	// 	| department_id | department_name | over_head_costs | product_sales | total_profit |
	// 	|---------------|-----------------|-----------------|---------------|--------------|
	// 	| 01            | Electronics     | 10000           | 20000         | 10000        |
	// 	| 02            | Clothing        | 60000           | 100000        | 40000        |
	//
	// 	* **HINT**: There may be an NPM package that can log the table to the console. What's is it? Good question :)

	//View Product Sales by Department
	if (answer.menuOption === "View All Departments") {
		console.log("Selected option 1");
		connection.query("SELECT * FROM departments", function(err, res) {
		  // for (var i = 0; i < res.length; i++) {
		  // 	var total_profit = res[i].total_sales - res[i].over_head_costs;
		  //   console.log(res[i].id + " | " + res[i].department_name + " | " + res[i].over_head_costs + " | " + res[i].total_sales + " | " + total_profit);
		  // }
		  console.table(res);
		  console.log("-----------------------------------");
		})
	}

	//Create New Department
	else if (answer.menuOption === "Create New Department") {
		console.log("Selected option 2");
			inquirer.prompt([{
		    name: "department_name",
		    type: "input",
		    message: "What is the name of the department you'd like to add?"
		}, {
		    name: "over_head_costs",
		    type: "input",
		    message: "What are the overhead costs for that department?"
		}]).then(function(answer) {
			connection.query("INSERT INTO departments SET ?", {
		      department_name: answer.department_name,
		      over_head_costs: parseFloat(answer.over_head_costs)
		    }, function(err, res) {
		      console.log("Your department was created successfully!");
		    });
		});
	}
});