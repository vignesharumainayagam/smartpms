# Copyright (c) 2013, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.utils import cstr, cint, getdate
from frappe import msgprint, _

def execute(filters=None):
	if not filters: filters = {}
	conditions = get_conditions(filters)
	columns, data = [], []
	columns=get_columns()
	hours_list=get_hours_list(conditions,filters)
	for hour_log in sorted(hours_list):
		row=[hour_log.equipment_name,hour_log.running_hours,hour_log.total_running_hours,hour_log.from_date,hour_log.to_date]
		data.append(row)
	return columns, data

def get_columns():
	columns = [
		_("Equipment Name") + "::200", _("Running Hours") + "::200", _("Total Running Hours")+ "::120",
		_("From Date") + "::120", _("To Date") + "::120"
		
	]
	return columns
def get_hours_list(conditions, filters):
	hours_list = frappe.db.sql("""select equipment_name, from_date,to_date,
		running_hours,total_running_hours from `tabRunning Hours Log` where equipment_name <> '' %s """ %
		conditions, filters, as_dict=1)
	return hours_list

def get_conditions(filters):
	conditions = ""
	if filters.get("item"): conditions += " and equipment_name=%(item)s"
	if filters.get("from_date"): conditions += " and from_date>=%(from_date)s"
	if filters.get("to_date"): conditions += " and to_date<=%(to_date)s"
	return conditions

@frappe.whitelist()
def get_runninhrsbased_items():
	items = frappe.db.get_list('Item', 'item_code', filters={"running_hour_based": 1})
	return items