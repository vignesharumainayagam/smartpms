frappe.provide("erpnext.requisition");
frappe.provide("frappe.treeview_settings");

frappe.pages['Requisition'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Requisition',
		single_column: true
	});

frappe.call({
					method: "frappe.client.get_list",
					args: {
						doctype: "Item",
						fields: ["item_name","type", "parent_item", "image", "item_code"],
						limit_page_length: 200
						},
					callback: function(r){
						// console.log(r.message)
						var items = r.message;
						var functional = $.grep(items, function(v) {
						    return v.type == "Functional";
						}); 
						var sub_functional = $.grep(items, function(v) {
						    return v.type == "Sub functional";
						});
						var equipment = $.grep(items, function(v) {
						    return v.type == "Equipment";
						});
						var sub_equipment = $.grep(items, function(v) {
						    return v.type == "Sub Equipment";
						});

						var spare_group = $.grep(items, function(v) {
						    return v.type == "Spare Group";
						});

						var spare = $.grep(items, function(v) {
						    return v.type == "Spare";
						});

page.main.html(frappe.render_template("requisition", {a: functional, b: sub_functional, c: equipment, d: sub_equipment, e: spare_group, f: spare}));
vicky(page);



	$(".column2").html(frappe.render_template("requisition_item", {f: spare} ));





		}
			});

	// this.page.main.on("change", ".select_group", function() {
	// 	alert("HI")
	// });


}




function vicky(page){
	var equipment_field = frappe.ui.form.make_control({
		parent: $('.equipment_field'),
		df: {
			fieldtype: "Data",
			// options: "User",
			fieldname: "equipment_field",
			change: function(){

			}
		},
		only_input: true,
	});
	equipment_field.refresh()
////////////////////////////////////////////
	var make_field = frappe.ui.form.make_control({
		parent: $('.make_field'),
		df: {
			fieldtype: "Data",
			// options: "User",
			fieldname: "make_field",
			change: function(){
				console.log(make_field.get_value())
				a =  make_field.get_value()
			}
		},
		only_input: true,
	});
	make_field.refresh()
//////////////////////////////////////////////
	var model_field = frappe.ui.form.make_control({
		parent: $('.model_field'),
		df: {
			fieldtype: "Data",
			// options: "User",
			fieldname: "model_field",
			change: function(){

			}
		},
		only_input: true,
	});
	model_field.refresh()	
//////////////////////////////////////////////

	var sl_no_field = frappe.ui.form.make_control({
		parent: $('.sl_no_field'),
		df: {
			fieldtype: "Data",
			// options: "User",
			fieldname: "sl_no_field",
			change: function(){

			}
		},
		only_input: true,
	});
	sl_no_field.refresh()
//////////////////////////////////////////////

	var maker_add_field = frappe.ui.form.make_control({
		parent: $('.maker_add_field'),
		df: {
			fieldtype: "Data",
			// options: "User",
			fieldname: "maker_add_field",
			change: function(){

			}
		},
		only_input: true,
	});
	maker_add_field.refresh()	

//////////////////////////////////////////////

	var indent_no_field = frappe.ui.form.make_control({
		parent: $('.indent_no_field'),
		df: {
			fieldtype: "Data",
			// options: "User",
			fieldname: "indent_no_field",
			change: function(){

			}
		},
		only_input: true,
	});
	indent_no_field.refresh()	
//////////////////////////////////////////////

	var date_field = frappe.ui.form.make_control({
		parent: $('.date_field'),
		df: {
			fieldtype: "Date",
			// options: "User",
			fieldname: "date_field",
			change: function(){

			}
		},
		only_input: true,
	});
	date_field.refresh()	
//////////////////////////////////////////////

	var remark_field = frappe.ui.form.make_control({
		parent: $('.remark_field'),
		df: {
			fieldtype: "Data",
			// options: "User",
			fieldname: "remark_field",
			change: function(){

			}
		},
		only_input: true,
	});
	remark_field.refresh()	
//////////////////////////////////////////////

	var group_name = frappe.ui.form.make_control({
		parent: $('.group_name'),
		df: {
			fieldtype: "Data",
			// options: "User",
			fieldname: "group_name",
			change: function(){

			}
		},
		only_input: true,
	});
	group_name.refresh()	
//////////////////////////////////////////////

	var plate_no = frappe.ui.form.make_control({
		parent: $('.plate_no'),
		df: {
			fieldtype: "Data",
			// options: "User",
			fieldname: "plate_no",
			change: function(){

			}
		},
		only_input: true,
	});
	plate_no.refresh()	
//////////////////////////////////////////////

	var part_name = frappe.ui.form.make_control({
		parent: $('.part_name'),
		df: {
			fieldtype: "Data",
			// options: "User",
			fieldname: "part_name",
			change: function(){

			}
		},
		only_input: true,
	});
	part_name.refresh()	
//////////////////////////////////////////////

	var part_no = frappe.ui.form.make_control({
		parent: $('.part_no'),
		df: {
			fieldtype: "Data",
			// options: "User",
			fieldname: "part_no",
			change: function(){

			}
		},
		only_input: true,
	});
	part_no.refresh()	
//////////////////////////////////////////////

	var required_quan = frappe.ui.form.make_control({
		parent: $('.required_quan'),
		df: {
			fieldtype: "Data",
			// options: "User",
			fieldname: "required_quan",
			change: function(){

			}
		},
		only_input: true,
	});
	required_quan.refresh()	
//////////////////////////////////////////////

	var select_group = frappe.ui.form.make_control({
		parent: $('.select_group'),
		df: {
			fieldtype: "Select",
			options: [],
			fieldname: "select_group",
			change: function(){

			}
		},
		only_input: true,
	});
	select_group.refresh()	
//////////////////////////////////////////////

	var other_prop = frappe.ui.form.make_control({
		parent: $('.other_prop'),
		df: {
			fieldtype: "Select",
			options: ['','Critical','Vital','ROB less then Minimum order level'],
			fieldname: "other_prop",
			change: function(){

			}
		},
		only_input: true,
	});
	other_prop.refresh()	
//////////////////////////////////////////////

page.set_primary_action(__("Save"), function () {
	console.log(make_field)
	// set_value("make_field", "Vicky");
	// page.main.find("[data-fieldname='make_field']").val("vicky");
}, "fa fa-plus")



$(".eb").click (function () {
	var text = $(this).text();
	frappe.call({
						method: "frappe.client.get_list",
						args: {
							doctype: "Item",
							filters: {"type": "Spare Group", "parent_item": text.trim()},
							fields: ["item_name","type", "parent_item"],
							limit_page_length: 200
							},	
						callback: function(r){
							select_group.df.options = [];
							var testArr = select_group.df.options;
							for(var i=0; i<r.message.length; i++) {
								if ($.inArray(r.message[i].item_name, select_group.df.options) == -1)
								{
									select_group.df.options.push(r.message[i].item_name);
									select_group.refresh()
								}
						
							}	
								console.log($.inArray("dasd", select_group.df.options))

						}	

	});

	frappe.call({
						method: "frappe.client.get_list",
						args: {
							doctype: "Item",
							filters: {"item_name": text.trim()},
							fields: ["item_name","make", "model", "makers_address", "serial_no"],
							limit_page_length: 1
							},	
						callback: function(r){
							console.log(r.message)
							equipment_field.set_value(r.message[0].item_name);
							make_field.set_value(r.message[0].make)
							model_field.set_value(r.message[0].model)
							sl_no_field.set_value(r.message[0].serial_no)
							maker_add_field.set_value(r.message[0].makers_address)
						}	
	});	

});



$(".seb").click (function () {
	var text = $(this).text();
	frappe.call({
						method: "frappe.client.get_list",
						args: {
							doctype: "Item",
							filters: {"type": "Spare Group", "parent_item": text.trim()},
							fields: ["item_name","type", "parent_item"],
							limit_page_length: 200
							},	
						callback: function(r){
							select_group.df.options = [];
							var testArr = select_group.df.options;
							for(var i=0; i<r.message.length; i++) {
								if ($.inArray(r.message[i].item_name, select_group.df.options) == -1)
								{
									select_group.df.options.push(r.message[i].item_name);
									select_group.refresh()
								}
						
							}	
								console.log($.inArray("dasd", select_group.df.options))

						}	

	});

	frappe.call({
						method: "frappe.client.get_list",
						args: {
							doctype: "Item",
							filters: {"item_name": text.trim()},
							fields: ["item_name","make", "model", "makers_address", "serial_no"],
							limit_page_length: 1
							},	
						callback: function(r){
							console.log(r.message)
							equipment_field.set_value(r.message[0].item_name);
							make_field.set_value(r.message[0].make)
							model_field.set_value(r.message[0].model)
							sl_no_field.set_value(r.message[0].serial_no)
							maker_add_field.set_value(r.message[0].makers_address)
						}	
	});	

});


}