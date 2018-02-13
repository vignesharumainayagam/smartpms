// Copyright (c) 2018, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Spare Group', {
	tree: function(frm) {

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
					$(d.body).html(frappe.render_template("spare_tree", {a: functional, b: sub_functional, c: equipment, d: sub_equipment} ));
					d.show();
					$(".seb").dblclick (function () {
						var b = $(this).find("a").text();
						console.log(b)
						frm.set_value("parent", b)
						d.hide();
	 				});

					$(".eb").dblclick (function () {
						var b = $(this).find("a").text();
						console.log(b)
						frm.set_value("parent", b)
						d.hide();
					});

					}
				});		
}

});