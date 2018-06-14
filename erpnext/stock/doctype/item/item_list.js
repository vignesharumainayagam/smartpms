frappe.listview_settings['Item'] = {
	add_fields: ["item_name", "stock_uom", "item_group", "image", "variant_of",
		"has_variants", "end_of_life", "disabled", "total_projected_qty"],
	filters: [["disabled", "=", "0"]],

	get_indicator: function(doc) {
		if (doc.disabled) {
			return [__("Disabled"), "grey", "disabled,=,Yes"];
		} else if (doc.end_of_life && doc.end_of_life < frappe.datetime.get_today()) {
			return [__("Expired"), "grey", "end_of_life,<,Today"];
		} else if(doc.total_projected_qty < 0) {
			return [__("Shortage"), "red", "total_projected_qty,<,0"];
		} else if (doc.has_variants) {
			return [__("Template"), "orange", "has_variants,=,Yes"];
		} else if (doc.variant_of) {
			return [__("Variant"), "green", "variant_of,=," + doc.variant_of];
		}
	},
	enable_tree:true,
	columnFilter:"parent_item",
	onload: function (doclist) {
		// $(".btn-primary").hide();	
	exec_treefilter('item','parent_item');
	console.log(doclist.page)

	


	},
	set_primary_action:function(doclist){

	doclist.page.set_primary_action(__("Help"), function() {
					var d = new frappe.ui.Dialog({
					title: __('Help Tutorial: '),
					width: 800
					});
	var	FlyerPath = 'EymUNHbynew';			
	$(d.body).html('<iframe src="https://www.youtube.com/embed/' + FlyerPath + '?rel=0"></iframe>');
					d.show();

	}, "octicon octicon-plus");

		// doclist.page.clear_primary_action();
		// doclist.page.set_secondary_action(__("Neadsdw"), function() {
	
		// 	frappe.ui.get_upload_dialog({
		// 		"args": {
		// 			"folder": doclist.current_folder,
		// 			"from_form": 1
		// 		},
		// 		callback: function() {
		// 			doclist.refresh();
		// 		}
		// 	});
		// }, "octicon octicon-plus");
	},		
	refresh: function () {
		// $(".btn-primary").hide();	

		
		
	// exec_treefilter();
	// alert();


	},

	reports: [
		{
			name: 'Stock Summary',
			report_type: 'Page',
			route: 'stock-balance'
		},
		{
			name: 'Stock Ledger',
			report_type: 'Script Report'
		},
		{
			name: 'Stock Balance',
			report_type: 'Script Report'
		},
		{
			name: 'Stock Projected Qty',
			report_type: 'Script Report'
		}

	]
};

frappe.help.youtube_id["Item"] = "qXaEwld4_Ps";
