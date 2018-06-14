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
	due_report_list=get_due_report_list(conditions,filters)
	for due_report in sorted(due_report_list):
		row=[]
		if due_report.maintenance_status=='Planned':
			row.append("Due")
		else:
			row.append(due_report.maintenance_status)

		row.append(due_report.maintenance_task)
		row.append(due_report.asset_name)
		row.append(due_report.periodicity)
		row.append(due_report.last_completion_date)
		row.append(due_report.next_due_date)
		row.append(due_report.position_in_vessel)
		row.append(due_report.class_code)
		row.append(due_report.maintenance_type)
		row.append(due_report.assign_to)
		row.append(due_report.procedure)
		data.append(row)
	return columns, data

def get_columns():
	columns = [
		_("Status") + "::100", 
		_("Maintenance Name") + "::200",
		_("Equipment Name")+ "::200",
		_("Frequency") + "::120",
		_("Last Done Date") + "::120",
		_("Next Due Date") + "::120",
		_("Position In Vessel") + "::120",
		_("Class Code") + "::120",
		_("Maintenance Type") + "::120",
		_("Responsibility") + "::120",
		_("Procedures") + "::200"
		
	]
	return columns

def get_conditions(filters):
	conditions = ""
	if filters.get("item"): conditions += " and M.asset_name=%(item)s"
	if filters.get("departmant"): conditions += " and T.maintenance_team=%(departmant)s"
	if filters.get("from_date"): conditions += " and T.next_due_date >= %(from_date)s"
	if filters.get("classcode"): conditions += " and T.classcode=%(classcode)s"
	if filters.get("maintenance_type"): conditions += " and T.maintenance_type=%(maintenance_type)s"

	return conditions

def get_due_report_list(conditions, filters):
	due_report_list = frappe.db.sql("""select  
			T.*,M.asset_name,I.position_in_vessel
			from `tabAsset Maintenance Task` T
			inner join `tabAsset Maintenance` M on M.name=T.parent
			inner join `tabItem` I on I.item_code=M.item_code
			where  T.name <> '' %s """ %
		conditions, filters, as_dict=1)
	return due_report_list
