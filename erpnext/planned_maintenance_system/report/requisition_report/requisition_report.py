# Copyright (c) 2013, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import msgprint, _

def execute(filters=None):
	columns = [
				_("Request ID") + "::150",
				_("Type") + "::150",
				_("Requiered Date") + "::150",
				_("Status") + "::150",
				_("Item") + "::200",
				_("Quantity") + "::100"
			  ]
	data = frappe.db.sql("""
			select
				a.name, a.material_request_type, a.schedule_date, a.status, b.item_code, b.qty
			from
				`tabMaterial Request` a, `tabMaterial Request Item` b, 'tabItem' c
			where
				a.name = b.parent and b.item_name = c.type""")
	return columns, data


# def get_conditions(filters):
# 	conditions = ""
# 	if filters.get("functional_block"): conditions += " and type=%(functional_block)s"
# 	if filters.get("subfunctional_block"): conditions += " and type = %(subfunctional_block)s"
# 	if filters.get("equipment_block"): conditions += " and type>=%(equipment_block)s"
# 	if filters.get("subequipment_block"): conditions += " and type = %(subequipment_block)s"
# 	if filters.get("from_date"): conditions += " and target_date>=%(from_date)s"
# 	if filters.get("to_date"): conditions += " and repair_status=%(to_date)s"

# 	return conditions