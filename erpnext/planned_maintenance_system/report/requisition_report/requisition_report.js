// Copyright (c) 2016, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
/* eslint-disable */

// frappe.query_reports["Requisition Report"] = {
// 	"filters": [

// 	]
// }
// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.query_reports["Requisition Report"] = {
	"filters": [
		// {
		// 	"fieldname":"functional_block",
		// 	"label": __("Functional Block"),
		// 	"fieldtype": "Link",
		// 	"options": "Item",
		// 	"get_query": function() {
		// 		return {
		// 			// "query": "erpnext.controllers.queries.get_account_list",
		// 			filters: {"type": ["in", ["Functional"]]}
		// 		}
		// 	}
		// 	// "default": frappe.defaults.get_user_default("Company")
		// },
		// {
		// 	"fieldname":"subfunctional_block",
		// 	"label": __("Sub Functional Block"),
		// 	"fieldtype": "Link",
		// 	"options": "Item",
		// 	"get_query": function() {
		// 		return {
		// 			// "query": "erpnext.controllers.queries.get_account_list",
		// 			filters: {"type": ["=", ["Sub functional"]]}
		// 		}
		// 	}			
		// 	// "default": frappe.defaults.get_user_default("Company")
		// },
		// {
		// 	"fieldname":"equipment_block",
		// 	"label": __("Equipment Block"),
		// 	"fieldtype": "Link",
		// 	"options": "Item",
		// 	"get_query": function() {
		// 		return {
		// 			// "query": "erpnext.controllers.queries.get_account_list",
		// 			filters: {"type": ["=", ["Equipment"]]}
		// 		}
		// 	}
		// 	// "default": frappe.defaults.get_user_default("Company")
		// },
		// {
		// 	"fieldname":"subequipment_block",
		// 	"label": __("Sub Equipment Block"),
		// 	"fieldtype": "Link",
		// 	"options": "Item",
		// 	"get_query": function() {
		// 		return {
		// 			// "query": "erpnext.controllers.queries.get_account_list",
		// 			filters: {"type": ["=", ["Sub Equipment"]]}
		// 		}
		// 	}
		// 	// "default": frappe.defaults.get_user_default("Company")
		// },
		// // {
		// // 	"fieldtype": "Break",
		// // },
		// {
		// 	"fieldname":"status",
		// 	"label": __("Status"),
		// 	"fieldtype": "Select",
		// 	"options": 'Draft\nPending\n',
		// },
		// {
		// 	"fieldname":"from_date",
		// 	"label": __("From Date"),
		// 	"fieldtype": "Date",
		// 	// "default": "60",
		// 	// "reqd": 1
		// },
		// {
		// 	"fieldname":"to_date",
		// 	"label": __("To Date"),
		// 	"fieldtype": "Date",
		// 	// "default": "90",
		// 	// "reqd": 1
		// }
	],
	onload: function(report) {
		// console.log(report)
		// report.page.add_inner_button(__("Accounts Payable Summary"), function() {
		// 	var filters = report.get_values();
		// 	frappe.set_route('query-report', 'Accounts Payable Summary', {company: filters.company});
		// });

	}
}
