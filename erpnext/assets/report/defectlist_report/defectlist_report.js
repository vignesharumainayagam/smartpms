// Copyright (c) 2016, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["DefectList Report"] = {
	"filters": [
		{
			"fieldname":"item",
			"label": __("Item"),
			"fieldtype": "Link",
			"options": "Item"
		},
		{
			"fieldname":"repair_status",
			"label": __("Status"),
			"fieldtype": "Select",
			"options": "\nPending\nCompleted",
			"reqd": 0
		},
		{
			"fieldname":"entry_from_date",
			"label": __("Entry From Date"),
			"fieldtype": "Date",
			"reqd": 0
		},
		{
			"fieldname":"entry_to_date",
			"label": __("Entry To Date"),
			"fieldtype": "Date",
			"reqd": 0
		},
		{
			"fieldname":"target_from_date",
			"label": __("Target From Date"),
			"fieldtype": "Date",
			"reqd": 0
		},
		{
			"fieldname":"target_to_date",
			"label": __("Target To Date"),
			"fieldtype": "Date",
			"reqd": 0
		}
	]
}
