frappe.ui.form.on("Running Hours Entry", "select_in_tree_view", function(frm) {


    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Item",
            fields: ["item_name", "type", "parent_item"],
            limit_page_length: 200
        },
        callback: function(r) {
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
            $(d.body).html(frappe.render_template("running_hours", {
                a: functional,
                b: sub_functional,
                c: equipment,
                d: sub_equipment
            }));
            d.show();
            $(".seb").dblclick(function() {
                var b = $(this).find("a").text();
                console.log(b)
                frm.set_value("under", b)
                d.hide();
            });

            $(".eb").dblclick(function() {
                var b = $(this).find("a").text();
                console.log(b)
                frm.set_value("under", b)
                d.hide();
            });

            $(".fb").dblclick(function() {
                var b = $(this).find("a").text();
                console.log(b)
                frm.set_value("under", b)
                d.hide();
            });

            $(".sfb").dblclick(function() {
                var b = $(this).find("a").text();
                console.log(b)
                frm.set_value("under", b)
                d.hide();
            });

        }
    });


})

frappe.ui.form.on("Running Hours Entry", "onload", function(frm) {


    frm.refresh_field("under");
    frm.set_value("under", null)


    for (var i = 0; i < frm.doc.table_7.length; i++) {
        cur_frm.get_field("table_7").grid.grid_rows[i].remove()
    }

    for (var i = 0; i < frm.doc.table_8.length; i++) {
        cur_frm.get_field("table_8").grid.grid_rows[i].remove()
    }


    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Item",
            fields: ["item_name", "last_update_date", "running_hours", "item_code"],
            filters: {
                "running_hour_based": 1
            },
            limit_page_length: 2000
        },
        callback: function(r) {
            
                    if (r.message) {
                        frm.doc.table_7 = [];
                        $.each(r.message, function(i, d) {
                            var a = '';
                            if (d.last_update_date) {
                                a = frappe.datetime.add_days(d.last_update_date, 1)
                                }
                            else{ a = '1990-01-01'}
                            var row = frappe.model.add_child(frm.doc, "Running Hours Entry Difference", "table_7");
                            row.equipment_name = d.item_code;
                            row.from_date = a;
                            row.running_hours_before_update = d.running_hours;
                            row.last_updated_on = d.last_update_date;
                        });
                    }
                    refresh_field("table_7");

                    if (r.message) {
                        frm.doc.table_8 = [];
                        $.each(r.message, function(i, d) {
                            var a;
                            if (d.last_update_date) {
                                a = frappe.datetime.add_days(d.last_update_date, 1)}
                            else{ a = '1990-01-01'}
                            var row = frappe.model.add_child(frm.doc, "Running Hours Child Actual", "table_8");
                            row.equipment_name = d.item_code;
                            row.from_date = a;
                            row.running_hours_before_update = d.running_hours;
                            row.last_updated_on = d.last_update_date;
                        });
                    }
                    refresh_field("table_8");


        }
    });

});

frappe.ui.form.on("Running Hours Entry", "after_save", function(frm) {
    location.reload();
});

frappe.ui.form.on("Running Hours Entry", "type", function(frm) {

    frm.set_value("under", null)
    frm.refresh_field("under");

});


frappe.ui.form.on("Running Hours Entry", "under", function(frm) {

if (frm.doc.type == "Runing Hours(Only difference)") {
    for (var i = 0; i < frm.doc.table_7.length; i++) {
        cur_frm.get_field("table_7").grid.grid_rows[i].remove()
    }
}
else if (frm.doc.type == "Total Running Hours(Actual Current Reading)") {
    for (var i = 0; i < frm.doc.table_8.length; i++) {
        cur_frm.get_field("table_8").grid.grid_rows[i].remove()
    }
}
    if (frm.doc.under) {
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Item",
                fields: ["item_name", "last_update_date", "running_hours", "item_code"],
                filters: {
                    "running_hour_based": 1,
                    "functional_block": frm.doc.under.trim()
                },
                limit_page_length: 2000
            },
            callback: function(r) {
                console.log(r.message)
                // for (var e = 0; e < r.message.length; e++) {

                    if (frm.doc.type == "Runing Hours(Only difference)") {

                    if (r.message) {
                        frm.doc.table_7 = [];
                        $.each(r.message, function(i, d) {
                            var a = '';
                            if (d.last_update_date) {
                                a = frappe.datetime.add_days(d.last_update_date, 1)
                                }
                            else{ a = '1990-01-01'}
                            var row = frappe.model.add_child(frm.doc, "Running Hours Entry Difference", "table_7");
                            row.equipment_name = d.item_code;
                            row.from_date = a;
                            row.running_hours_before_update = d.running_hours;
                            row.last_updated_on = d.last_update_date;
                        });
                    }
                    refresh_field("table_7");


                    } else if (frm.doc.type == "Total Running Hours(Actual Current Reading)") {


                    if (r.message) {
                        frm.doc.table_8 = [];
                        $.each(r.message, function(i, d) {
                            var a;
                            if (d.last_update_date) {
                                a = frappe.datetime.add_days(d.last_update_date, 1)}
                            else{ a = '1990-01-01'}
                            var row = frappe.model.add_child(frm.doc, "Running Hours Child Actual", "table_8");
                            row.equipment_name = d.item_code;
                            row.from_date = a;
                            row.running_hours_before_update = d.running_hours;
                            row.last_updated_on = d.last_update_date;
                        });
                    }
                    refresh_field("table_8");

                    }

                // }

            }
        });
    }

});


frappe.ui.form.on("Running Hours Child Actual", "total_running_hours", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    var total = 0;
   if (d.to_date){ if (d.running_hours_before_update) {
           frappe.model.set_value(cdt, cdn, "running_hours", parseInt(d.total_running_hours) - parseInt(d.running_hours_before_update));
       } else {
           frappe.model.set_value(cdt, cdn, "running_hours", parseInt(d.total_running_hours) - 0);
       }}
    else{
        
        frappe.model.set_value(cdt, cdn, "total_running_hours", null);
        frappe.throw('Please Enter to-date before entering running hours')
        
    }   

});


frappe.ui.form.on("Running Hours Entry Difference", "running_hours", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    var total = 0;
    if (d.to_date){if (d.running_hours_before_update) {
            frappe.model.set_value(cdt, cdn, "total_running_hours", parseInt(d.running_hours_before_update) + parseInt(d.running_hours));
        } else {
            frappe.model.set_value(cdt, cdn, "total_running_hours", 0 + parseInt(d.running_hours));
        }
    }
    else{
        frappe.model.set_value(cdt, cdn, "running_hours", null);
        frappe.throw('Please Enter to-date before entering running hours')
        
    }   

});


frappe.ui.form.on("Running Hours Child Actual", "to_date", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
   if (d.to_date){ 
        if (d.to_date <= d.from_date ) {
            frappe.model.set_value(cdt, cdn, "to_date", null);
            frappe.throw('To date should be greater then from date')

       }
   }
       

});

frappe.ui.form.on("Running Hours Entry Difference", "to_date", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    var d = locals[cdt][cdn];
   if (d.to_date){ 
        if (d.to_date <= d.from_date ) {
            frappe.model.set_value(cdt, cdn, "to_date", null);
            frappe.throw('To date should be greater then from date')
       }
   }
       

});


