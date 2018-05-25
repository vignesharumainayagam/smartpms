// Copyright (c) 2018, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Defect', {
	refresh: function(frm) {

	}
});


frappe.ui.form.on("Defect", "refresh", function(frm) { 
    cur_frm.set_query("sub_functional_block", function() {
        return {
            "filters": {
                "type": ("Sub functional")
            }
        };
    });   
});

frappe.ui.form.on("Defect", "refresh", function(frm) { 
    cur_frm.set_query("equipment", function() {
        return {
            "filters": {
                "type": ("Equipment"),
                "parent1": frm.doc.sub_functional_block
            }
        };
    });   
});

frappe.ui.form.on("Defect", "refresh", function(frm) { 
    cur_frm.set_query("sub_equipment", function() {
        return {
            "filters": {
                "type": ("Sub Equipment"),
                "parent1": frm.doc.equipment
            }
        };
    });   
});

