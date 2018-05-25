from __future__ import unicode_literals
import frappe, json


@frappe.whitelist()
def get_items():
	currentdate = frappe.utils.nowtime()
	array = []
	functional_blocks = frappe.get_list("Item", filters={"type": "Functional"}, 
										fields=["item_name", "item_code"], 
										limit_page_length= 200)

	for x in functional_blocks:
		c_date = frappe.utils.nowdate()
		thirty_date = frappe.utils.add_days(frappe.utils.nowdate(), 30)
		maintenance = frappe.get_list("Asset Maintenance", 
			filters={"parent_functional": x.item_code}, fields=["asset_name"], limit_page_length= 500)

		for y in maintenance:
			maintenance_tasks = frappe.get_list("Asset Maintenance Task", 
				filters={"parent": y.asset_name}, fields=["maintenance_type", "next_due_date"], limit_page_length= 500)

		for y in maintenance:
			maintenance_tasks_thirty = frappe.get_list("Asset Maintenance Task", 
				filters={"parent": y.asset_name, "next_due_date": ("<", thirty_date)}, 
				fields=["maintenance_type", "next_due_date"], limit_page_length= 500)

		for y in maintenance:
			maintenance_tasks_today = frappe.get_list("Asset Maintenance Task", 
				filters={"parent": y.asset_name, "next_due_date": ("=", c_date)}, 
				fields=["maintenance_type", "next_due_date"], limit_page_length= 500)
					
			array.append({"Functional Block":x.item_code,"No of Maintenances": len(maintenance_tasks),
			 "next_30_days": len(maintenance_tasks_thirty), 
			 "as_of_today": len(maintenance_tasks_today) })


	return array

