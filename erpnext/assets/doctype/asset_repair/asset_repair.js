// Copyright (c) 2017, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Asset Repair', {
	repair_status: (frm) => {
		if (frm.doc.completion_date && frm.doc.repair_status == "Completed") {
			frappe.call ({
				method: "erpnext.assets.doctype.asset_repair.asset_repair.get_downtime",
				args: {
					"failure_date":frm.doc.failure_date,
					"completion_date":frm.doc.completion_date
				},
				callback: function(r) {
					if(r.message) {
						frm.set_value("downtime", r.message + " Hrs");
					}
				}
			});
		}
	}
});



frappe.ui.form.on("Asset Repair", "validate", function (frm) {
	if (frm.doc.type == "Sub functional") {
		frm.set_value("functional_block", frm.doc.parent_item);
	}
	else if(frm.doc.type == "Equipment"){
		frm.set_value("subfunctional_block", frm.doc.parent_item);
		frappe.call({
				method: "frappe.client.get_list",
				args: {
					doctype: "Item",
					fields: ["parent_item"],
					filters: {
						"name": frm.doc.subfunctional_block
					}
				},
				callback: function(r) {
					frm.set_value("functional_block", r.message[0].parent_item);
					console.log(r.message[0].parent_item)
				}
	
			});	
	}
	else if(frm.doc.type == "Sub Equipment" ){
		frm.set_value("equipment_block", frm.doc.parent_item);
		frappe.call({
				method: "frappe.client.get_list",
				args: {
					doctype: "Item",
					fields: ["parent_item"],
					filters: {
						"name": frm.doc.equipment_block
					}
				},
				callback: function(r) {
				frm.set_value("subfunctional_block", r.message[0].parent_item);
				
				frappe.call({
				method: "frappe.client.get_list",
				args: {
					doctype: "Item",
					fields: ["parent_item"],
					filters: {
						"name": frm.doc.subfunctional_block
					}
				},
				callback: function(r) {
					frm.set_value("functional_block", r.message[0].parent_item);
				}
	
			});	
				}
	
			});			
	}


});

frappe.ui.form.on("Asset Repair", "asset_name", function (frm) {
frappe.call({
			method: "frappe.client.get_value",
			args: {
				doctype: "Item",
				filters: {"name": frm.doc.asset_name},
				fieldname: "type"
			},
			callback: function(r){
				console.log(r.message)

				frm.set_value("type", r.message.type)
			}
		});

frappe.call({
			method: "frappe.client.get_value",
			args: {
				doctype: "Item",
				filters: {"name": frm.doc.asset_name},
				fieldname: "parent_item"
			},
			callback: function(r){
				console.log(r.message)
				frm.set_value("parent_item", r.message.parent_item)
			}
		});
});

frappe.ui.form.on("Asset Repair", "asset_name", function (frm) {
	if (frm.doc.type == "Sub functional") {
		frm.set_value("functional_block", frm.doc.parent_item);
	}
	else if(frm.doc.type == "Equipment"){
		frm.set_value("sub_functional_block", frm.doc.parent_item);
		frappe.call({
				method: "frappe.client.get_list",
				args: {
					doctype: "Item",
					fields: ["parent_item"],
					filters: {
						"name": frm.doc.sub_functional_block
					}
				},
				callback: function(r) {
					frm.set_value("functional_block", r.message[0].parent_item);
					console.log(r.message[0].parent_item)
				}
	
			});	
	}
	else if(frm.doc.type == "Sub Equipment" ){
		frm.set_value("equipment_block", frm.doc.parent_item);
		frappe.call({
				method: "frappe.client.get_list",
				args: {
					doctype: "Item",
					fields: ["parent_item"],
					filters: {
						"name": frm.doc.equipment_block
					}
				},
				callback: function(r) {
				frm.set_value("sub_functional_block", r.message[0].parent_item);
				
				frappe.call({
				method: "frappe.client.get_list",
				args: {
					doctype: "Item",
					fields: ["parent_item"],
					filters: {
						"name": frm.doc.sub_functional_block
					}
				},
				callback: function(r) {
					frm.set_value("functional_block", r.message[0].parent_item);
				}
	
			});	
				}
	
			});			
	}


});