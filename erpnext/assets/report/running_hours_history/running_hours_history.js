// Copyright (c) 2016, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Running Hours History"] = {
	"filters": [
		{
			"fieldname":"Item",
			"label": __("Item"),
			"fieldtype": "Link",
			"options": "Item"
		},
		{
			"fieldname":"from_date",
			"label": __("From Date"),
			"fieldtype": "Date",
			"reqd": 0
		},
		{
			"fieldname":"to_date",
			"label": __("To Date"),
			"fieldtype": "Date",
			"reqd": 0
		}
	],
	"onload": function() {
	    return  frappe.call({
			method: "erpnext.assets.report.running_hours_history.running_hours_history.get_runninhrsbased_items",
			callback: function(r) {
				console.log(r);
			}
		});
	}
}
