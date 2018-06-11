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
	},
	onload: (frm) => {
		// $('[data-fieldname="select_from_tree_view"]').text('');
		// $('[data-fieldname="select_from_tree_view"]').addClass('fa');
		// $('[data-fieldname="select_from_tree_view"]').addClass('fa-search');

	},
});

frappe.ui.form.on("Asset Repair", "select_from_tree_view", function (frm) {
// frm.add_custom_button(__('Select from Tree View'), function() {

			frappe.call({
					method: "frappe.client.get_list",
					args: {
						doctype: "Item",
						fields: ["item_name","type", "parent_item"],
						limit_page_length: 200
						},
					callback: function(r){ 
						console.log(r.message)
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
					$(d.body).html(frappe.render_template("asset_repair_tree", {a: functional, b: sub_functional, c: equipment, d: sub_equipment} ));
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
// });
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