# -*- coding: utf-8 -*-
# Copyright (c) 2018, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class RunningHoursEntry(Document):
	def on_update(self):
		frappe.db.sql("""Delete from `tabRunning Hours Entry Difference`""")
		frappe.db.sql("""Delete from `tabRunning Hours Child Actual`""")

	def validate(self):
		if self.type == "Runing Hours(Only difference)":
			for x in self.table_7:
				if x.total_running_hours:
					x.r_h = x.total_running_hours
				else:
					x.r_h = x.running_hours_before_update
				frappe.db.set_value("Item", x.equipment_name, "running_hours", x.r_h)
				frappe.db.set_value("Item", x.equipment_name, "last_update_date", x.to_date)	
				new_doc = {'doctype': 'Running Hours Log', 'equipment_name': x.equipment_name , 
						   'from_date': x.from_date, 'to_date': x.to_date,
						   'running_hours': x.running_hours, 'total_running_hours': x.r_h,
						   'running_hours_before_update': x.running_hours_before_update, 'last_updated_on': x.last_updated_on}
				new_asset_repair = frappe.get_doc(new_doc)
				new_asset_repair.insert()


		elif self.type == "Total Running Hours(Actual Current Reading)":
			for x in self.table_8:
				if x.total_running_hours:
					x.r_h = x.total_running_hours
				else:
					x.r_h = x.running_hours_before_update
						
				frappe.db.set_value("Item", x.equipment_name, "running_hours", x.r_h)
				frappe.db.set_value("Item", x.equipment_name, "last_update_date", x.to_date)		
				new_doc = {'doctype': 'Running Hours Log', 'equipment_name': x.equipment_name , 
						   'from_date': x.from_date, 'to_date': x.to_date,
						   'running_hours': x.running_hours, 'total_running_hours': x.total_running_hours,
						   'running_hours_before_update': x.running_hours_before_update, 'last_updated_on': x.last_updated_on}
				new_asset_repair = frappe.get_doc(new_doc)
				new_asset_repair.insert()

		
		

@frappe.whitelist()
def delete_child_table_items():
	frappe.db.sql("""Delete from `tabRunning Hours Entry Difference`""")
	frappe.db.sql("""Delete from `tabRunning Hours Child Actual`""")
