// Copyright (c) 2018, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Section', {
    onload: function(frm) {
        frm.set_query("chapter_name", function() {
            return {
                filters: {
                    'subject_name': frm.doc.subject_name,	
                }
            }
        });
    }
});