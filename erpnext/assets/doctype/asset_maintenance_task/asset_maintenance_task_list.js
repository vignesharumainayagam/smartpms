frappe.listview_settings['Asset Maintenance Task'] = {
	enable_tree:true,
	columnFilter:"parent",
	add_fields: ["parent"],
	onload: function (doclist) {
		console.log(doclist);	
	 	exec_treefilter('item','parent');
	 	// $('.container .page-content .frappe-list .result').html("<h1>Vicky</h1>");
	},
	post_render_item: function(list, row, data) {
		// if(data.is_folder) {
			$(row).find(".list-id").attr("href", "#Form/Asset Maintenance/" + data.parent);
		// }
	},
};
