
frappe.provide("frappe.treeview_settings");
frappe.treeview_settings['Item'] = {
	get_tree_nodes: "erpnext.stock.doctype.item.item.get_children",
	add_tree_node: "erpnext.stock.doctype.item.item.add_node",
	breadcrumb: "Planned Maintenance System",
	get_tree_root: false,
	root_label: "All Items",
	ignore_fields: ["parent_item"],
	onload: function(me) {
		frappe.treeview_settings['Item'].page = {};
		$.extend(frappe.treeview_settings['Item'].page, me.page);
		me.make_tree();
		// $(".btn-primary").hide();
	},
	toolbar: [
		{
			label:__("Add Child"),
			condition: function(node) { return node.is_root || node.data.expandable },
			click: function select_type(node){ add_child(node) }
		},
		{
			label:__("Edit"),
				condition: function(node) {
					return !node.is_root;
				},
				click: function(node) {
					frappe.set_route("Form", "Item", node.label);
				}
		},
		{
				label:__("Delete"),
				condition: function(node) { return !node.is_root && frappe.model.can_delete("Item"); },
				click: function(node) {
					frappe.model.delete_doc("Item", node.label, function() {
						node.parent.remove();
					});
				},
				btnClass: "hidden-xs"
		},
		{
				label:__("Add Spare Group"),
				condition: function(node) { 
						return !node.is_root && node.parent_label != "All Items" &&  node.data.expandable},
				click: function(node) {
					spare_group(node)
				},
				btnClass: "hidden-xs"
		},
		{
				label:__("Add Spare"),
				condition: function(node) 
				{ return !node.is_root && node.parent_label != "All Items" && node.parent_node.parent_label != "All Items" && node.data.expandable },
				click: function(node) {
					spare(node)
				},
				btnClass: "hidden-xs"
		},

	],
	extend_toolbar: false,

}



function add_child(node) {

if (node.parent_label == null) {
	frappe.new_doc("Item", {
			"type": "Functional",
			"parent_item": null,
			"is_group": 1
			});
		}

else {

	frappe.call({
			method: "frappe.client.get_value",
			args: {
				doctype: "Item",
				fieldname: "type",
				filters: { name: node.title },
				},
			callback: function(r) {
				if (r.message.type == "Spare Group") { frappe.msgprint("You can create only spare bellow a spare group") }
				else{
				if (node.parent_node.parent_label == null) {

							frappe.new_doc("Item", {
								"type": "Sub functional",
								"parent_item": node.title,
								"is_group": 1,
								"functional_block": node.title
							});

				}
				else if (node.parent_node.parent_node.parent_label == null) {
							frappe.new_doc("Item", {
								"type": "Equipment",
								"parent_item": node.title,
								"is_group": 1,
								"subfunctional_block": node.title,
								"functional_block": node.parent_label
							});		
				}
				else if (node.parent_node.parent_node.parent_node.parent_label == null) {
							frappe.new_doc("Item", {
								"type": "Sub Equipment",
								"parent_item": node.title,
								"is_group": 1,
								"equipment_block": node.title,
								"subfunctional_block": node.parent_label,
								"functional_block": node.parent_node.parent_label
							});			
				}
				else  {
							frappe.msgprint("You cant create any child at this level")		
				}
					}

				}
	

	});



	}

}



function spare(node) {
frappe.call({
			method: "frappe.client.get_list",
			args: {
				doctype: "Item",
				// fieldname: "type",
				fields: ["type", "parent_item"],
				filters: { name: node.title },
				},
			callback: function(r) {
				if (r.message[0].type != "Spare Group") { frappe.throw(__("You can create Spare only Under a Spare Group")) }
					else{

							frappe.call({
									method: "frappe.client.get_value",
									args: {
									doctype: "Item",
									fieldname: "type",
									filters: { name: r.message[0].parent_item },
										},
									callback: function(r) {
										console.log(r.message)
										console.log(node)
										if (r.message.type == "Sub functional") {

											frappe.new_doc("Item", {
											"type": "Spare",
											"parent_item": node.title,
											"spare_group": node.title,
											"subfunctional_block": node.parent_label,
											"functional_block": node.parent_node.parent_label,
											"is_group": 1
											});

										}
											else if (r.message.type == "Equipment") {

												frappe.new_doc("Item", {
												"type": "Spare",
												"parent_item": node.title,
												"spare_group": node.title,
												"equipment_block": node.parent_label,
												"subfunctional_block": node.parent_node.parent_label,
												"functional_block": node.parent_node.parent_node.parent_label,
												"is_group": 1
												});

											}
												else if (r.message.type == "Sub Equipment") {

													frappe.new_doc("Item", {
													"type": "Spare",
													"parent_item": node.title,
													"spare_group": node.title,
													"sub_equipment": node.parent_label,
													"equipment_block": node.parent_node.parent_label,
													"subfunctional_block": node.parent_node.parent_node.parent_label,
													"functional_block": node.parent_node.parent_node.parent_node.parent_label,
													"is_group": 1
													});

												}

									}
								});



					}
			
				}
	});
}





function spare_group(node){
frappe.call({
				method: "frappe.client.get_value",
				args: {
					doctype: "Item",
					fieldname: "type",
					filters: { name: node.title },
				},
				callback: function(r) {

					if(r.message) {
						console.log(node)
						if(r.message.type == "Spare Group"){ frappe.throw(__("You cant create Spare Group Under a Spare Group")) }
				
							else if (r.message.type == "Sub functional") {
								frappe.new_doc("Item", {
								"type": "Spare Group",
								"parent_item": node.title,
								"subfunctional_block": node.title,
								"functional_block": node.parent_label,
								"is_group": 1
								});

							}
								else if (r.message.type == "Equipment") {
									frappe.new_doc("Item", {
									"type": "Spare Group",
									"parent_item": node.title,
									"equipment_block": node.title,
									"subfunctional_block": node.parent_label,
									"functional_block": node.parent_node.parent_label,
									"is_group": 1
									});

								}
									else if (r.message.type == "Sub Equipment") {
										frappe.new_doc("Item", {
										"type": "Spare Group",
										"parent_item": node.title,
										"sub_equipment": node.title,
										"equipment_block": node.parent_label,
										"subfunctional_block": node.parent_node.parent_label,
										"functional_block": node.parent_node.parent_node.parent_label,
										"is_group": 1
										});

									}
						

							}

					},

});
}
