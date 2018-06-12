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
				`tabMaterial Request` a, `tabMaterial Request Item` b
			where
				a.name = b.parent""")
	return columns, data
