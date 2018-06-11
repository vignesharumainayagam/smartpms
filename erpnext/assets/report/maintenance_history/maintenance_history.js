// Copyright (c) 2016, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Maintenance History"] = {
	"filters": [
		{
			"fieldname":"item",
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
		},
		{
			"fieldname":"classcode",
			"label": __("Class Code"),
			"fieldtype": "Data",
			"reqd": 0
		},
		{
			"fieldname":"maintenance_type",
			"label": __("Maintenance Type"),
			"fieldtype": "Link",
			"options": "Maintenance Type"
		},
		{
			"fieldname":"reason_for_the_job",
			"label": __("Reason For Job"),
			"fieldtype": "Select",
			"options": "\nPMS\nBreakdown\nDefect\nDrop in Performance"
		}
		
	]
}
