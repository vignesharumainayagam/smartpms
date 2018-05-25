frappe.pages['dashboard'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Dashboard',
		single_column: true
	});
var a = frappe.call({
		method: "erpnext.planned_maintenance_system.page.dashboard.dashboard.get_items",
		callback: function(r){
			console.log(r.message)
			page.main.html(frappe.render_template("dashboard_main", {data: r.message}));
		}	  
})



}