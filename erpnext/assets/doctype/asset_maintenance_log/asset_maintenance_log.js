// Copyright (c) 2017, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Asset Maintenance Log', {
	asset_maintenance: (frm) => {
		frm.set_query('task', function(doc) {
			return {
				query: "erpnext.assets.doctype.asset_maintenance_log.asset_maintenance_log.get_maintenance_tasks",
				filters: {
					'asset_maintenance': doc.asset_maintenance
				}
			};
		});
	},
	completion_date: (frm) => {
		var a = String(frm.doc.completion_date)
		if (a == frappe.datetime.get_today) {
			alert('please select a valid date.');
		}
		check_wether_running_hours_based(frm);
	},

});

function check_wether_running_hours_based(frm) {
	// frappe.call({
	// 	method: 'frappe.client.get_value',
	// 	args: {
	// 		doctype: "Company",
	// 		filters: {"name": frm.doc.company},
	// 		fieldname: "cost_center" 
	// 	},

	// });
};