// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

{% include 'erpnext/public/js/controllers/buying.js' %};

frappe.ui.form.on('Material Request', {
	setup: function(frm) {
		frm.custom_make_buttons = {
			'Stock Entry': 'Issue Material',
			'Purchase Order': 'Purchase Order',
			'Request for Quotation': 'Request for Quotation',
			'Supplier Quotation': 'Supplier Quotation',
			'Production Order': 'Production Order'
		}
	},
	refresh: function(frm){
  
    frm.set_query("sub_func_block", function(frm) {
    	  console.log(frm.doc.functional_block)
            return {
                query: "erpnext.stock.doctype.material_request.material_request.get_subfunctionalblocks",
                 filters: {
                 'types':"Sub functional",
                 'functional_block': frm.doc.functional_block
               }

            };
        });
	},
	onload: function(frm) {
		// add item, if previous view was item
		erpnext.utils.add_item(frm);

		//set schedule_date
		set_schedule_date(frm);

		// formatter for material request item
		frm.set_indicator_formatter('item_code',
			function(doc) { return (doc.qty<=doc.ordered_qty) ? "green" : "orange" }),

		frm.fields_dict["items"].grid.get_field("warehouse").get_query = function(doc, cdt, cdn){
			return{
				filters: {'company': doc.company}
			}
		}
    frm.set_query("functional_block", function(frm) {
            return {
                query: "erpnext.stock.doctype.material_request.material_request.get_functionalblocks",

            };
        });

   
		 frappe.call({
				method: "erpnext.stock.doctype.material_request.material_request.get_members",
				args: { 
					"doctype":frm.doc.doctype,
					 'types':"Sub functional",
                 'functional_block': frm.doc.functional_block,
					"txt":"",
					"searchfield":"",
					"start":0,
					"page_len":35

				},
				callback: function(r) {
                       console.log(r.message)
				}
			});

	}
});

frappe.ui.form.on("Material Request Item", {
	qty: function (frm, doctype, name) {
		var d = locals[doctype][name];
		if (flt(d.qty) < flt(d.min_order_qty)) {
			frappe.msgprint(__("Warning: Material Requested Qty is less than Minimum Order Qty"));
		}
	},

	item_code: function(frm, doctype, name) {
		set_schedule_date(frm);
	},

	schedule_date: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.schedule_date) {
			if(!frm.doc.schedule_date) {
				erpnext.utils.copy_value_in_all_row(frm.doc, cdt, cdn, "items", "schedule_date");
			} else {
				set_schedule_date(frm);
			}
		}
	}
});

erpnext.buying.MaterialRequestController = erpnext.buying.BuyingController.extend({
	onload: function(doc) {
		this._super();
		this.frm.set_query("item_code", "items", function() {
			return {
				query: "erpnext.controllers.queries.item_query"
			}
		});
	},

	refresh: function(doc) {
		var me = this;
		this._super();

		if(doc.docstatus==0) {
			cur_frm.add_custom_button(__("Get Items from BOM"),
				cur_frm.cscript.get_items_from_bom, "fa fa-sitemap", "btn-default");
		}

		if(doc.docstatus == 1 && doc.status != 'Stopped') {
			if(flt(doc.per_ordered, 2) < 100) {
				// make
				if(doc.material_request_type === "Material Transfer")
					cur_frm.add_custom_button(__("Transfer Material"),
					this.make_stock_entry, __("Make"));

				if(doc.material_request_type === "Material Issue")
					cur_frm.add_custom_button(__("Issue Material"),
					this.make_stock_entry, __("Make"));

				if(doc.material_request_type === "Purchase")
					cur_frm.add_custom_button(__('Purchase Order'),
						this.make_purchase_order, __("Make"));

				if(doc.material_request_type === "Purchase")
					cur_frm.add_custom_button(__("Request for Quotation"),
						this.make_request_for_quotation, __("Make"));

				if(doc.material_request_type === "Purchase")
					cur_frm.add_custom_button(__("Supplier Quotation"),
					this.make_supplier_quotation, __("Make"));

				if(doc.material_request_type === "Manufacture")
					cur_frm.add_custom_button(__("Production Order"),
					function() { me.raise_production_orders() }, __("Make"));

				cur_frm.page.set_inner_btn_group_as_primary(__("Make"));

				// stop
				cur_frm.add_custom_button(__('Stop'),
					cur_frm.cscript['Stop Material Request']);

			}
		}

		if (this.frm.doc.docstatus===0) {
			this.frm.add_custom_button(__('Sales Order'),
				function() {
					erpnext.utils.map_current_doc({
						method: "erpnext.selling.doctype.sales_order.sales_order.make_material_request",
						source_doctype: "Sales Order",
						target: me.frm,
						setters: {
							company: me.frm.doc.company
						},
						get_query_filters: {
							docstatus: 1,
							status: ["!=", "Closed"],
							per_delivered: ["<", 99.99],
						}
					})
				}, __("Get items from"));
		}

		if(doc.docstatus == 1 && doc.status == 'Stopped')
			cur_frm.add_custom_button(__('Re-open'),
				cur_frm.cscript['Unstop Material Request']);

	},

	get_items_from_bom: function() {
		var d = new frappe.ui.Dialog({
			title: __("Get Items from BOM"),
			fields: [
				{"fieldname":"bom", "fieldtype":"Link", "label":__("BOM"),
					options:"BOM", reqd: 1, get_query: function(){
						return {filters: { docstatus:1 }}
					}},
				{"fieldname":"warehouse", "fieldtype":"Link", "label":__("Warehouse"),
					options:"Warehouse", reqd: 1},
				{"fieldname":"fetch_exploded", "fieldtype":"Check",
					"label":__("Fetch exploded BOM (including sub-assemblies)"), "default":1},
				{fieldname:"fetch", "label":__("Get Items from BOM"), "fieldtype":"Button"}
			]
		});
		d.get_input("fetch").on("click", function() {
			var values = d.get_values();
			if(!values) return;
			values["company"] = cur_frm.doc.company;
			frappe.call({
				method: "erpnext.manufacturing.doctype.bom.bom.get_bom_items",
				args: values,
				callback: function(r) {
					if(!r.message) {
						frappe.throw(__("BOM does not contain any stock item"))
					} else {
						erpnext.utils.remove_empty_first_row(cur_frm, "items");
						$.each(r.message, function(i, item) {
							var d = frappe.model.add_child(cur_frm.doc, "Material Request Item", "items");
							d.item_code = item.item_code;
							d.item_name = item.item_name;
							d.description = item.description;
							d.warehouse = values.warehouse;
							d.uom = item.stock_uom;
							d.qty = item.qty;
						});
					}
					d.hide();
					refresh_field("items");
				}
			});
		});
		d.show();
	},

	tc_name: function() {
		this.get_terms();
	},

	validate_company_and_party: function(party_field) {
		return true;
	},

	calculate_taxes_and_totals: function() {
		return;
	},

	make_purchase_order: function() {
		frappe.model.open_mapped_doc({
			method: "erpnext.stock.doctype.material_request.material_request.make_purchase_order",
			frm: cur_frm,
			run_link_triggers: true
		});
	},

	make_request_for_quotation: function(){
		frappe.model.open_mapped_doc({
			method: "erpnext.stock.doctype.material_request.material_request.make_request_for_quotation",
			frm: cur_frm,
			run_link_triggers: true
		});
	},

	make_supplier_quotation: function() {
		frappe.model.open_mapped_doc({
			method: "erpnext.stock.doctype.material_request.material_request.make_supplier_quotation",
			frm: cur_frm
		});
	},

	make_stock_entry: function() {
		frappe.model.open_mapped_doc({
			method: "erpnext.stock.doctype.material_request.material_request.make_stock_entry",
			frm: cur_frm
		});
	},

	raise_production_orders: function() {
		var me = this;
		frappe.call({
			method:"erpnext.stock.doctype.material_request.material_request.raise_production_orders",
			args: {
				"material_request": me.frm.doc.name
			},
			callback: function(r) {
				if(r.message.length) {
					me.frm.reload_doc();
				}
			}
		});
	},

	validate: function() {
		set_schedule_date(this.frm);
	},

	items_add: function(doc, cdt, cdn) {
		var row = frappe.get_doc(cdt, cdn);
		if(doc.schedule_date) {
			row.schedule_date = doc.schedule_date;
			refresh_field("schedule_date", cdn, "items");
		} else {
			this.frm.script_manager.copy_from_first_row("items", row, ["schedule_date"]);
		}
	},

	items_on_form_rendered: function() {
		set_schedule_date(this.frm);
	},

	schedule_date: function() {
		set_schedule_date(this.frm);
	}
});

// for backward compatibility: combine new and previous states
$.extend(cur_frm.cscript, new erpnext.buying.MaterialRequestController({frm: cur_frm}));

cur_frm.cscript['Stop Material Request'] = function() {
	var doc = cur_frm.doc;
	$c('runserverobj', args={'method':'update_status', 'arg': 'Stopped', 'docs': doc}, function(r,rt) {
		cur_frm.refresh();
	});
};

cur_frm.cscript['Unstop Material Request'] = function(){
	var doc = cur_frm.doc;
	$c('runserverobj', args={'method':'update_status', 'arg': 'Submitted','docs': doc}, function(r,rt) {
		cur_frm.refresh();
	});
};

function set_schedule_date(frm) {
	if(frm.doc.schedule_date){
		erpnext.utils.copy_value_in_all_row(frm.doc, frm.doc.doctype, frm.doc.name, "items", "schedule_date");
	}
}


frappe.ui.form.on("Material Request", "onload", function(frm){
			

cur_frm.add_custom_button(__('Tree'),function() { 
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
					$(d.body).html(frappe.render_template("request_tree", {a: functional, b: sub_functional, c: equipment, d: sub_equipment} ));
					d.show();

					$(".fb").click (function () {
						var b = $(this).find("a").text();
						// console.log(b)
						frm.set_value("functional_block", b.trim())
						// d.hide();					
		 				});

					$(".sfb").click (function () {
						var b = $(this).find("a").text();
						// console.log(b)
						frm.set_value("sub_func_block", b.trim())
						// d.hide();					
		 				});

					$(".eb").click (function () {
						var b = $(this).find("a").text();
						// console.log(b)
						frm.set_value("equipment_block", b.trim())
						// d.hide();					
		 				});

					$(".seb").click (function () {
						var b = $(this).find("a").text();
						// console.log(b)
						frm.set_value("sub_equipment_block", b.trim())
						// d.hide();					
		 				});



					$(".seb").dblclick (function () {
						var b = $(this).find("a").text();
						// console.log(b)
						frm.set_value("selected_equipment_subequipment", b.trim())
						d.hide();
		 				});

					$(".eb").dblclick (function () {
						var b = $(this).find("a").text();
						// console.log(b)
						frm.set_value("selected_equipment_subequipment", b.trim())
						d.hide();

					});



					}
				});	
});

});

frappe.ui.form.on("Material Request", "selected_equipment_subequipment", function(frm) { 
var a = frm.doc.selected_equipment_subequipment;

frappe.call({
	method: "frappe.client.get_list",
	args: {
			doctype: "Item",
			fields: ["item_name","type", "parent_item", "image", "item_code"],
			// limit_page_length: 200
			filters: {
						"type": "Spare Group",
						"parent_item": a,
					}
		   },
	callback: function(r){
		console.log(r.message)
		var ar = [];
		// frm.refresh_field('groups');
		ar.push("All spare groups")
		for(var i=0; i<r.message.length; i++){
			
			ar.push(r.message[i].item_name)
		}
		frm.set_df_property('groups', 'options', ar);
				frm.refresh_field('groups');

	}	   
});

});



frappe.ui.form.on("Material Request", "refresh", function(frm) { 
    cur_frm.set_query("selected_equipment_subequipment", function() {
        return {
            "filters": {
            	"type": ["in", ["Sub Equipment", "Equipment"]]
                // "type": "Sub Equipment",
            }
        };
    });   
});


frappe.ui.form.on("Material Request", "groups", function(frm) { 
var a = frm.doc.groups;
if(a != "All spare groups"){

		frappe.call({
			method: "frappe.client.get_list",
			args: {
					doctype: "Item",
					fields: ["item_name","type", "parent_item", "image", "item_code"],
					// limit_page_length: 200
					filters: {
								"type": "Spare",
								"parent_item": a,
							}
				   },
			callback: function(r){
				console.log(r.message)

					for(var i=0; i<r.message.length; i++) {
					$.each(frm.doc.items || [], function(i, jvd) {
						frappe.model.set_value(jvd.doctype, jvd.name, "item_code", r.message[i].item_code);
					});

					}
		        frm.refresh_field("items");
			}	   
		});

}

else if(a == "All spare groups"){
var b = frm.doc.selected_equipment_subequipment;
console.log(b)
if(frm.doc.equipment_block && frm.doc.sub_equipment_block){
	console.log("it came first")
				frappe.call({
					method: "frappe.client.get_list",
					args: {
							doctype: "Item",
							fields: ["item_name","type", "parent_item", "image", "item_code"],
							// limit_page_length: 200
							filters: {
										"type": "Spare",
										"sub_equipment": b,
									}
						   },
					callback: function(v){
						console.log(v.message)


					}	   
				});
}
else if( frm.doc.equipment_block && !frm.doc.sub_equipment_block){
	console.log("it came second")

				frappe.call({
					method: "frappe.client.get_list",
					args: {
							doctype: "Item",
							fields: ["item_name","type", "parent_item", "image", "item_code"],
							// limit_page_length: 200
							filters: {
										"type": "Spare",
										"equipment_block": b,
									}
						   },
					callback: function(r){
						console.log(r.message)


					}	   
				});

}
		
	}
});

