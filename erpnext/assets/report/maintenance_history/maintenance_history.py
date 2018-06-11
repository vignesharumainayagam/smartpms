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
	history_report_list=get_history_report_list(conditions,filters)
	for history_report in sorted(history_report_list):
		row=[]
		row.append(history_report.item_name)
		row.append(history_report.maintenance_name)
		row.append(history_report.maintenance_type)
		row.append(history_report.periodicity)
		row.append(history_report.frequency)
		row.append(history_report.completion_date)
		row.append(history_report.last_running_hours_updated_date)
		data.append(row)

	return columns, data
def get_columns():
	columns = [
		_("Equipment / Sub-Equipment Name") + "::200",
		_("Maintenance Name") + "::200", 
		_("Maintenance Type") + "::200",
		_("Frequency Type") + "::120",
		_("Frequency") + "::120",
		_("Last Done Date") + "::120",
		_("Done Running Hour") + "::200"
		
	]
	return columns

def get_conditions(filters):
	conditions = ""
	if filters.get("item"): conditions += " and T.item_code=%(item)s"
	if filters.get("from_date"): conditions += " and T.completion_date >= %(from_date)s"
	if filters.get("to_date"): conditions += " and T.completion_date <= %(to_date)s"
	if filters.get("classcode"): conditions += " and MT.class_code <= %(to_date)s"
	if filters.get("maintenance_type"): conditions += " and MT.maintenance_type=%(maintenance_type)s"
	if filters.get("reason_for_the_job"): conditions += " and T.reason_for_the_job=%(reason_for_the_job)s"
	return conditions

def get_history_report_list(conditions, filters):
	due_report_list = frappe.db.sql("""select  
			T.item_name,MT.maintenance_type,T.periodicity,
			MT.frequency,
			MT.maintenance_name,
			T.completion_date,
			T.last_running_hours_updated_date
			from `tabAsset Maintenance Log` T
			inner join `tabAsset Maintenance Task` MT
			on T.task=MT.name
			where T.completion_date<>'' %s """ %
		conditions, filters, as_dict=1)
	return due_report_list