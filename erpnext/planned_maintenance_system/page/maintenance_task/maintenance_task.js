frappe.pages['maintenance-task'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Maintenance Task',
		single_column: true
	});
	this.wrapper = $(wrapper).find('.page-content');
	var r = frappe.call({
		method: 'erpnext.planned_maintenance_system.page.maintenance_task.maintenance_task.get_feed',
		async: false,
		callback: function (r) {
			// console.log(r);
		},
	});
	r = r.responseJSON.message;
	console.log(r)
	this.wrapper.html(frappe.render_template("tasklist", {result : r.result, total: r.total}));
}