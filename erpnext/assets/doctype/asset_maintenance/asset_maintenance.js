// Copyright (c) 2017, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
frappe.provide("erpnext.assets");

frappe.ui.form.on('Asset Maintenance', {
	setup: (frm) => {
		frm.set_query("assign_to", "asset_maintenance_tasks", function(frm, cdt, cdn) {
			child = locals[cdt][cdn];
			return {
				query: "erpnext.assets.doctype.asset_maintenance.asset_maintenance.get_team_members",
				filters: {
					maintenance_team: child.maintenance_team
				}
			};
		});

		frm.set_indicator_formatter('maintenance_status',
			function(doc) {
				let indicator = 'blue';
				if (doc.maintenance_status == 'Overdue') {
					indicator = 'orange';
				}
				if (doc.maintenance_status == 'Cancelled') {
					indicator = 'red';
				}
				return indicator;
			}
		);
	},
	refresh: (frm) => {
		if(!frm.is_new()) {
			frm.trigger('make_dashboard');
		}


	},
	make_dashboard: (frm) => {
		if(!frm.is_new()) {
			frappe.call({
				method: 'erpnext.assets.doctype.asset_maintenance.asset_maintenance.get_maintenance_log',
				args: {asset_name: frm.doc.asset_name},
				callback: (r) => {
					if(!r.message) {
						return;
					}
					var section = frm.dashboard.add_section(`<h5 style="margin-top: 0px;">
						${ __("Maintenance Log") }</a></h5>`);
					var rows = $('<div></div>').appendTo(section);
					// show
					(r.message || []).forEach(function(d) {
						$(`<div class='row' style='margin-bottom: 10px;'>
							<div class='col-sm-3 small'>
								<a onclick="frappe.set_route('List', 'Asset Maintenance Log', 
									{'asset_name': '${d.asset_name}','maintenance_status': '${d.maintenance_status}' });">
									${d.maintenance_status} <span class="badge">${d.count}</span>
								</a>
							</div>
						</div>`).appendTo(rows);
					});
					frm.dashboard.show();
				}
			});
		}
	}
});


frappe.ui.form.on('Asset Maintenance Task', {
	start_date: (frm, cdt, cdn)  => {
		get_next_due_date(frm, cdt, cdn);
	},
	periodicity: (frm, cdt, cdn)  => {
		get_next_due_date(frm, cdt, cdn);
	},
	frequency: (frm, cdt, cdn)  => {
		get_next_due_date(frm, cdt, cdn);
	},
	last_completion_date: (frm, cdt, cdn)  => {
		get_next_due_date(frm, cdt, cdn);
	},
	end_date: (frm, cdt, cdn)  => {
		get_next_due_date(frm, cdt, cdn);
	},
	refresh: (frm, cdt, cdn) => {
		var d = locals[cdt][cdn];
	},
	assign_to: (frm, cdt, cdn)  => {
		var d = locals[cdt][cdn];
		if (frm.doc.__islocal) {
			frappe.model.set_value(cdt, cdn, "assign_to", "");
			frappe.model.set_value(cdt, cdn, "assign_to_name", "");
			frappe.throw(__("Please save before assigning task."));
		}
		if (d.assign_to) {
			return frappe.call({
				method: 'erpnext.assets.doctype.asset_maintenance.asset_maintenance.assign_tasks',
				args: {
					asset_maintenance_name: frm.doc.name,
					assign_to_member: d.assign_to,
					maintenance_task: d.maintenance_task,
					next_due_date: d.next_due_date
				}
			});
		}
	}
});



var get_next_due_date = function (frm, cdt, cdn) {
	var d = locals[cdt][cdn];
	if (d.start_date && d.periodicity) {

		if (d.periodicity == 'Hourly') {
			// alert('');
			calculate_end_time(frm, cdt, cdn)
		}
		else{	
			return frappe.call({
				method: 'erpnext.assets.doctype.asset_maintenance.asset_maintenance.calculate_next_due_date',
				args: {
					start_date: d.start_date,
					periodicity: d.periodicity,
					end_date: d.end_date,
					last_completion_date: d.last_completion_date,
					next_due_date: d.next_due_date,
					frequency: d.frequency,
				},
				callback: function(r) {
					if (r.message) {
						console.log(r.message)
						frappe.model.set_value(cdt, cdn, "next_due_date", r.message);
					}
					else {
						frappe.model.set_value(cdt, cdn, "next_due_date", "");
					}
				}
			});
		}
	}
};


var calculate_end_time = function(frm, cdt, cdn) {
	let child = locals[cdt][cdn];

	if(!child.start_date) {
		// if from_time value is not available then set the current datetime
		frappe.model.set_value(cdt, cdn, "start_date", frappe.datetime.get_datetime_as_string());
	}

	let d = moment(child.start_date);
	if(child.frequency) {
		d.add(child.frequency, "hours");
		frm._setting_hours = true;
		frappe.model.set_value(cdt, cdn, "next_due_date",
			d.format(moment.defaultDatetimeFormat)).then(() => {
				frm._setting_hours = false;
			});
	}


	if((frm.doc.__islocal || frm.doc.__onload.maintain_bill_work_hours_same) && child.hours){
		frappe.model.set_value(cdt, cdn, "billing_hours", child.hours);
	}
}

frappe.ui.form.on("Asset Maintenance", "type", function (frm) {
if(frm.doc.type == "Sub functional"){sub_fun(frm)}
	else if(frm.doc.type == "Equipment"){ eqp(frm) }
		else if(frm.doc.type == "Sub Equipment"){sub_eqp(frm)}
});

function sub_eqp(frm){
frappe.call({
				method: "frappe.client.get_value",
				args: {
					doctype: "Item",
					fieldname: "parent_item",
					filters: { item_code: frm.doc.asset_name },
				},
				callback: function(r) {
					console.log(r.message)
					var equip_blk = r.message.parent_item; 
					frappe.call({
						method: "frappe.client.get_value",
						args: {
							doctype: "Item",
							fieldname: "parent_item",
							filters: { item_code: equip_blk },
						},
						callback: function(r) {
							console.log(r.message)
							var sub_func_blk = r.message.parent_item;
							frappe.call({
								method: "frappe.client.get_value",
								args: {
									doctype: "Item",
									fieldname: "parent_item",
									filters: { item_code: sub_func_blk },
								},
								callback: function(r) {
									console.log(r.message)
									var func_blk = r.message.parent_item;
									 	frm.set_value("parent_functional", func_blk);
								}
								})
						}
						})
				}
})	
}

function eqp(frm){
frappe.call({
				method: "frappe.client.get_value",
				args: {
					doctype: "Item",
					fieldname: "parent_item",
					filters: { item_code: frm.doc.asset_name },
				},
				callback: function(r) {
					console.log(r.message)
					var equip_blk = r.message.parent_item; 
					frappe.call({
						method: "frappe.client.get_value",
						args: {
							doctype: "Item",
							fieldname: "parent_item",
							filters: { item_code: equip_blk },
						},
						callback: function(r) {
							console.log(r.message)
							frm.set_value("parent_functional", r.message.parent_item)
						}
						})
				}
})	
}

function sub_fun(frm){
frappe.call({
				method: "frappe.client.get_value",
				args: {
					doctype: "Item",
					fieldname: "parent_item",
					filters: { item_code: frm.doc.asset_name },
				},
				callback: function(r) {
					console.log(r.message)
					frm.set_value("parent_functional", r.message.parent_item)
				}
})	
}






frappe.ui.form.on("Asset Maintenance", "asset_name", function (frm) {
frappe.call({
				method: "frappe.client.get_value",
				args: {
					doctype: "Item",
					fieldname: "type",
					filters: { item_code: frm.doc.asset_name },
				},
				callback: function(r) {
					frm.set_value("type", r.message.type)
				}
})	
});


frappe.ui.form.on("Asset Maintenance", "onload", function (frm) {
frm.add_custom_button(__('Select from Tree View'), function() {

			frappe.call({
					method: "frappe.client.get_list",
					args: {
						doctype: "Item",
						fields: ["item_name","type", "parent_item"],
						limit_page_length: 200
						},
					callback: function(r){ 
					var d = new frappe.ui.Dialog({
					title: __('Select Parent For Spare Group: '),
					width: 800
					});
						var items = r.message;
						var functional = $.grep(items, function(v) {
						    return v.type === "Functional";
						}); 
						var sub_functional = $.grep(items, function(v) {
						    return v.type === "Sub functional";
						});
						var equipment = $.grep(items, function(v) {
						    return v.type === "Equipment"
						});
						var sub_equipment = $.grep(items, function(v) {
						    return v.type === "Sub Equipment";
						});
					$(d.body).html(frappe.render_template("asset_tree", {a: functional, b: sub_functional, c: equipment, d: sub_equipment} ));
					d.show();
					$(".seb").dblclick (function () {
						var b = $(this).find("a").text();
						console.log(b)
						frm.set_value("asset_name", b)
						d.hide();
						frm.refresh_field("asset_name");
	 				});

					$(".eb").dblclick (function () {
						var b = $(this).find("a").text();
						console.log(b)
						frm.set_value("asset_name", b)
						d.hide();
						frm.refresh_field("asset_name");
					});

					$(".sfb").dblclick (function () {
						var b = $(this).find("a").text();
						console.log(b)
						frm.set_value("asset_name", b)
						d.hide();
						frm.refresh_field("asset_name");
	 				});

					}
				});	
});
});

