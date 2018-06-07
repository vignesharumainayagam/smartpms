
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
		{
				label:__("Add"),
				click: function(node) {
					// console.log(calculate_level(node));
					construct_args(node);
				},
				btnClass: "hidden-xs"
		},

	],
	extend_toolbar: false,

}

function calculate_level(node) {
	console.log(node)
	var total_levels = [];

				frappe.call({
				method: "frappe.client.get_list",
			
				args: {
				doctype: "Asset Category",
				fields: ["item_level"],
				},
				async: false,
				callback: function(r) {
					if (r.message) {					
						for(var i = 0; i<r.message.length; i++){
							total_levels.push(r.message[i].item_level);
						}
						total_levels = total_levels.sort();
					}
					else{
						frappe.msgprint("Please Create the Asset Categories and continue !")
					}
				}
				});			
	

	var parent_name = null;
	if (node.label) {
	if (node.label != 'All Items')
	{parent_name = node.label;}
	if (node.label == 'All Items')
	{parent_name = null;}
	
	
	}
	else {
		parent_name = null;
	}
	

	var parent_asset_category = '';
	if(parent_name){
		frappe.call({
					method: 'frappe.client.get_value',
					args: {
						'doctype': 'Asset',
						'filters': {'name': parent_name},
						'fieldname': ['asset_category']
					},
					async: false,
					callback: function(r) {
						if (r.message.asset_category) {
						parent_asset_category = r.message.asset_category;}
						else{parent_asset_category = null}
					
					}
					});	

	}
	else{
		parent_asset_category = null
	}


	var parent_category_level = 0;
		if (parent_asset_category) {
			frappe.call({
			method: 'frappe.client.get_value',
			args: {
				'doctype': 'Asset Category',
				'filters': {'name': parent_asset_category},
				'fieldname': ['item_level']
			},
			async: false,
			callback: function(r) {

				if (r.message.item_level){parent_category_level = r.message.item_level;}
				else{parent_category_level = 0;}
			}
			});
		}
		else{
			parent_category_level = 0;
		}

	var current_level = parseInt(parent_category_level) + 1;

	var current_level_type = '';
	frappe.call({
				method: 'frappe.client.get_value',
				args: {
					'doctype': 'Asset Category',
					'filters': {'item_level': current_level},
					'fieldname': ['name']
				},
				async: false,
				callback: function(r) {

					if (r.message.name){current_level_type = r.message.name;}
					else{frappe.msgprint("Please Create the Required level of Asset Categories and continue !")}
				}
				});


	var current_level_folder = '';
	frappe.call({
				method: 'frappe.client.get_value',
				args: {
					'doctype': 'Asset Category',
					'filters': {'item_level': current_level},
					'fieldname': ['is_folder']
				},
				async: false,
				callback: function(r) {

					current_level_folder = r.message.is_folder;
				
				}
				});

	return {'total_levels':total_levels, 'parent_name':parent_name, 'parent_asset_category':parent_asset_category, 'parent_category_level':parent_category_level, 'current_level':current_level, 'current_level_type':current_level_type, 'current_level_folder':current_level_folder}
}

function construct_args(node) {
var r = calculate_level(node);
console.log(r);
	if(r.total_levels.includes(r.current_level)){

		frappe.new_doc("Item", {
								"type": r.current_level_type,
								"parent_item": r.parent_name,
								"is_group": r.current_level_folder,
							});
	
	}
	else if(! total_levels.includes(r.current_level)){
		frappe.msgprint("You cant create any child at this level")
	}
	 
}

function add_child(node) {

calculate_level(node)

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
				else {
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
