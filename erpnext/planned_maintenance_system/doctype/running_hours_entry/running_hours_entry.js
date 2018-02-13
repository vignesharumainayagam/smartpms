// Copyright (c) 2018, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt


frappe.ui.form.on("Running Hours Entry", "select_in_tree_view", function (frm) {


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
					$(d.body).html(frappe.render_template("running_hours", {a: functional, b: sub_functional, c: equipment, d: sub_equipment} ));
					d.show();
					$(".seb").dblclick (function () {
						var b = $(this).find("a").text();
						console.log(b)
						frm.set_value("under", b)
						d.hide();
		 				});

					$(".eb").dblclick (function () {
						var b = $(this).find("a").text();
						console.log(b)
						frm.set_value("under", b)
						d.hide();
					});

					$(".fb").dblclick (function () {
						var b = $(this).find("a").text();
						console.log(b)
						frm.set_value("under", b)
						d.hide();
		 				});

					$(".sfb").dblclick (function () {
						var b = $(this).find("a").text();
						console.log(b)
						frm.set_value("under", b)
						d.hide();
					});

					}
				});	


})




frappe.ui.form.on("Running Hours Entry", "onload", function (frm) {

frm.refresh_field("under");
for(var i=0; i< frm.doc.table_7.length; i++){
cur_frm.get_field("table_7").grid.grid_rows[i].remove()
}	
frm.set_value("under", null)

frappe.call({
	method: "frappe.client.get_list",
	args: {
			doctype: "Item",
			fields: ["item_name", "last_update_date", "running_hours", "item_code"],
			filters: {"running_hour_based": 1},
			limit_page_length: 2000
		  },
	callback: function(r){ 
	console.log(r.message)
	    for(var e=0; e<r.message.length; e++)
	    {

			if(frm.doc.type == "Runing Hours(Only difference)")	{

		        frappe.model.add_child(cur_frm.doc, "Running Hours Entry Difference", "table_7");  
		        $.each(frm.doc.table_7 || [], function(e, v) {
		        frappe.model.set_value(v.doctype, v.name, "equipment_name", r.message[e].item_code)
		        frappe.model.set_value(v.doctype, v.name, "running_hours_before_update", r.message[e].running_hours)
		        frappe.model.set_value(v.doctype, v.name, "last_updated_on", r.message[e].last_update_date)
		        })
		        frm.refresh_field("table_7");

				}

			else if(frm.doc.type == "Total Running Hours(Actual Current Reading)"){


		        frappe.model.add_child(cur_frm.doc, "Running Hours Child Actual", "table_8");  
		        $.each(frm.doc.table_8 || [], function(e, v) {
		        frappe.model.set_value(v.doctype, v.name, "equipment_name", r.message[e].item_code)
		        frappe.model.set_value(v.doctype, v.name, "running_hours_before_update", r.message[e].running_hours)
		        frappe.model.set_value(v.doctype, v.name, "last_updated_on", r.message[e].last_update_date)
		        })
		        frm.refresh_field("table_8");

				}

	    }

	}	  
});

});



frappe.ui.form.on("Running Hours Entry", "type", function (frm) {

frm.refresh_field("under");
for(var i=0; i< frm.doc.table_7.length; i++){
cur_frm.get_field("table_7").grid.grid_rows[i].remove()
}	

for(var i=0; i< frm.doc.table_8.length; i++){
cur_frm.get_field("table_8").grid.grid_rows[i].remove()
}
frm.set_value("under", null)

frappe.call({
	method: "frappe.client.get_list",
	args: {
			doctype: "Item",
			fields: ["item_name", "last_update_date", "running_hours", "item_code"],
			filters: {"running_hour_based": 1},
			limit_page_length: 2000
		  },
	callback: function(r){ 
	console.log(r.message)
	    for(var e=0; e<r.message.length; e++)
	    {

			if(frm.doc.type == "Runing Hours(Only difference)")	{

		        frappe.model.add_child(cur_frm.doc, "Running Hours Entry Difference", "table_7");  
		        $.each(frm.doc.table_7 || [], function(e, v) {
		        frappe.model.set_value(v.doctype, v.name, "equipment_name", r.message[e].item_code)
		        frappe.model.set_value(v.doctype, v.name, "running_hours_before_update", r.message[e].running_hours)
		        frappe.model.set_value(v.doctype, v.name, "last_updated_on", r.message[e].last_update_date)
		        })
		        frm.refresh_field("table_7");

				}

			else if(frm.doc.type == "Total Running Hours(Actual Current Reading)"){


		        frappe.model.add_child(cur_frm.doc, "Running Hours Child Actual", "table_8");  
		        $.each(frm.doc.table_8 || [], function(e, v) {
		        frappe.model.set_value(v.doctype, v.name, "equipment_name", r.message[e].item_code)
		        frappe.model.set_value(v.doctype, v.name, "running_hours_before_update", r.message[e].running_hours)
		        frappe.model.set_value(v.doctype, v.name, "last_updated_on", r.message[e].last_update_date)
		        })
		        frm.refresh_field("table_8");

				}

	    }

	}	  
});

});


frappe.ui.form.on("Running Hours Entry", "under", function (frm) {

for(var i=0; i< frm.doc.table_8.length; i++){
cur_frm.get_field("table_8").grid.grid_rows[i].remove()
}	

frappe.call({
	method: "frappe.client.get_list",
	args: {
			doctype: "Item",
			fields: ["item_name", "last_update_date", "running_hours", "item_code"],
			filters: {"running_hour_based": 1, "functional_block": frm.doc.under.trim()},
			limit_page_length: 2000
		  },
	callback: function(r){ 
	console.log(r.message)
	    for(var e=0; e<r.message.length; e++)
	    {

			if(frm.doc.type == "Runing Hours(Only difference)")	{

		        frappe.model.add_child(cur_frm.doc, "Running Hours Entry Difference", "table_7");  
		        $.each(frm.doc.table_7 || [], function(e, v) {
		        frappe.model.set_value(v.doctype, v.name, "equipment_name", r.message[e].item_code)
		        frappe.model.set_value(v.doctype, v.name, "running_hours_before_update", r.message[e].running_hours)
		        frappe.model.set_value(v.doctype, v.name, "last_updated_on", r.message[e].last_update_date)
		        })
		        frm.refresh_field("table_7");

				}

			else if(frm.doc.type == "Total Running Hours(Actual Current Reading)"){


		        frappe.model.add_child(cur_frm.doc, "Running Hours Child Actual", "table_8");  
		        $.each(frm.doc.table_8 || [], function(e, v) {
		        frappe.model.set_value(v.doctype, v.name, "equipment_name", r.message[e].item_code)
		        frappe.model.set_value(v.doctype, v.name, "running_hours_before_update", r.message[e].running_hours)
		        frappe.model.set_value(v.doctype, v.name, "last_updated_on", r.message[e].last_update_date)
		        })
		        frm.refresh_field("table_8");

				}

	    }

	}	  
});

});


frappe.ui.form.on("Running Hours Child Actual", "total_running_hours", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
var total = 0;
frappe.model.set_value(cdt, cdn, "running_hours", parseInt(d.total_running_hours) - parseInt(d.running_hours_before_update));
});  




frappe.ui.form.on("Running Hours Entry Difference", "running_hours", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
var total = 0;
frappe.model.set_value(cdt, cdn, "total_running_hours", parseInt(d.running_hours_before_update) + parseInt(d.running_hours));
});  


frappe.ui.form.on("Running Hours Entry", "type", function(frm, cdt, cdn) {
frm.set_value("under", null)
});  

frappe.ui.form.on("Running Hours Entry", "validate", function (frm) {

	if (frm.doc.type == "Runing Hours(Only difference)") {
		for(var d=0; d<frm.doc.table_7.length; d++){
			$.ajax({
	          url : location.origin+"/api/resource/Running Hours Log",
	          dataType: 'text',
	          type: 'POST',
	          contentType: 'application/json',
	          data : JSON.stringify( {
	          "equipment_name" : frm.doc.table_7[d].equipment_name,
	          "from_date" : frm.doc.table_7[d].from_date,
	          "to_date" : frm.doc.table_7[d].to_date,
	          "running_hours" : frm.doc.table_7[d].running_hours,
	          "total_running_hours" : frm.doc.table_7[d].total_running_hours,
	          "running_hours_before_update" : frm.doc.table_7[d].running_hours_before_update,
	          "last_updated_on" : frm.doc.table_7[d].last_updated_on,
	          }
	          ),
	          beforeSend: function(xhr){
	          xhr.setRequestHeader(
	          'X-Frappe-CSRF-Token', frappe.csrf_token
	          );
	          },success: function(data){
	          console.log(data);
	          }, error: function(error){
	          console.log(error);
	          }
	          });


			$.ajax({
	          url : location.origin+"/api/resource/Item/"+frm.doc.table_7[d].equipment_name ,
	          dataType: 'text',
	          type: 'PUT',
	          contentType: 'application/json',
	          data : JSON.stringify({
	          "running_hours" : frm.doc.table_7[d].total_running_hours,
	          "last_update_date" : frm.doc.table_7[d].to_date,
	          }),
	          beforeSend: function(xhr){
	          xhr.setRequestHeader(
	          'X-Frappe-CSRF-Token', frappe.csrf_token
	          );
	          },success: function(data){
	          console.log(data);
	          }, error: function(error){
	          console.log(error);
	          }
	          });



		}
	}


	else if(frm.doc.type == "Total Running Hours(Actual Current Reading)"){

		for(var d=0; d<frm.doc.table_8.length; d++){

			$.ajax({
	          url : location.origin+"/api/resource/Running Hours Log",
	          dataType: 'text',
	          type: 'POST',
	          contentType: 'application/json',
	          data : JSON.stringify( {
	          "equipment_name" : frm.doc.table_8[d].equipment_name,
	          "from_date" : frm.doc.table_8[d].from_date,
	          "to_date" : frm.doc.table_8[d].to_date,
	          "running_hours" : frm.doc.table_8[d].running_hours,
	          "total_running_hours" : frm.doc.table_8[d].total_running_hours,
	          "running_hours_before_update" : frm.doc.table_8[d].running_hours_before_update,
	          "last_updated_on" : frm.doc.table_8[d].last_updated_on,
	          }
	          ),
	          beforeSend: function(xhr){
	          xhr.setRequestHeader(
	          'X-Frappe-CSRF-Token', frappe.csrf_token
	          );
	          },success: function(data){
	          console.log(data);
	          }, error: function(error){
	          console.log(error);
	          }
	          });

			$.ajax({
	          url : location.origin+"/api/resource/Item/"+frm.doc.table_8[d].equipment_name ,
	          dataType: 'text',
	          type: 'PUT',
	          contentType: 'application/json',
	          data : JSON.stringify({
	          "running_hours" : frm.doc.table_8[d].total_running_hours,
	          "last_update_date" : frm.doc.table_8[d].to_date,
	          }),
	          beforeSend: function(xhr){
	          xhr.setRequestHeader(
	          'X-Frappe-CSRF-Token', frappe.csrf_token
	          );
	          },success: function(data){
	          console.log(data);
	          }, error: function(error){
	          console.log(error);
	          }
	          });

		}




	}
});