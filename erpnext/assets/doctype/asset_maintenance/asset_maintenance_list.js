frappe.listview_settings['Asset Maintenance'] = {
	enable_tree:true,
	columnFilter:"asset_name",
	onload: function (doclist) {
		// $(".btn-primary").hide();	
	exec_treefilter('item','asset_name');
	
	

	}

};
$(document).ready(function(){
// alert('');

});