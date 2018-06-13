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
	validate: (frm) => {
		// frm.set_value('checklist_completed', 'No');
		if(frm.doc.checklist_completed == "No" && frm.doc.maintenance_status == "Completed" && frm.doc.completion_date){

		// frm.add_custom_button(__('Complete Checklist'), function () {

		frappe.call({
			method: 'frappe.client.get_value',
			args: {
				doctype: 'Asset Maintenance Task',
				fieldname: 'procedure',
				filters: {
					'name': frm.doc.task,
				}
			},
			callback: function (r) {
				if (r.message) {
					console.log(r.message)
					frappe.call({
							method: "frappe.client.get_list",
							args: {
								doctype: "Procedure Check Points",
								fields: ["subject"],
								filters: {
									"parent": r.message.procedure,
								}
							},
							callback: function(r) {
								if (r.message){	
									
									console.log(r.message)
									var d = new frappe.ui.Dialog({
									title: __('Checklist for completing the maintenance.'),
									primary_action: function() {
											var rowCount = $('#checklist tr').length - 1;
											var checkcount = $('#checklist').find('input[type="checkbox"]:checked');
						 					console.log(checkcount.length)
						 					rowCount = parseInt(rowCount);
						 					checkcount = parseInt(checkcount.length)
						 					if (checkcount == rowCount) {
						 						frm.set_value('checklist_completed', "Yes");
						 						d.hide();
						 						cur_frm.savesubmit();
						 						// frappe.call({
						 						// 	method:'erpnext.assets.doctype.asset_maintenance_log.asset_maintenance_log.get_maintenance_tasks'
						 						// })
						 						// cur_frm.clear_custom_buttons();
						 					}
						 					else{
						 						frm.set_value('checklist_completed', "No");
						 						d.hide();
						 					}

									},
									primary_action_label: __('Update'),
									width: 1000
									});
									var items = r.message;
									$(d.body).html(frappe.render_template("checklist", {a: items} ));
									d.show();

			
								}
							}
				
						});	

				}
			}
		});


	// });
	}
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