# Copyright (c) 2013, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

def execute(filters=None):
	if not filters: filters = {}
	conditions = get_conditions(filters)
	columns, data = [], []
	columns=get_columns()
	return columns, data
def get_columns():
	columns = [
		_("Equipment / Sub-Equipment Name") + "::200", 
		_("Maintenance Type") + "::200",
		_("Frequency") + "::120",
		_("Frequency Type") + "::120",
		_("Last Done Date") + "::120",
		_("Done Running Hour") + "::200"
		
	]
	return columns

def get_conditions(filters):
	conditions = ""
	if filters.get("item"): conditions += " and M.asset_name=%(item)s"
	if filters.get("from_date"): conditions += " and T.next_due_date >= %(from_date)s"
	if filters.get("to_date"): conditions += " and T.next_due_date <= %(to_date)s"
	if filters.get("classcode"): conditions += " and T.classcode=%(classcode)s"
	if filters.get("maintenance_type"): conditions += " and T.maintenance_type=%(maintenance_type)s"
	return conditions