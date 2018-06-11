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
	defect_list=get_defect_list(conditions,filters)
	for defect in sorted(defect_list):
		row=[]
		row.append(defect.defect_list_from)
		row.append(getDefectFunction(defect.item_code))
		row.append(getDefectCategory(defect.item_code))
		row.append(defect.item_code)
		row.append(defect.description)
		row.append(defect.risk_level)
		row.append(defect.repair_status)
		row.append(defect.failure_date)
		row.append(defect.target_date)
		row.append(defect.completion_date)
		if defect.shore_assistance_required==1:
			row.append("Yes")
		else:
			row.append("No")
		row.append(defect.spares_required_reference)
		data.append(row)
	return columns, data
def getDefectFunction(itemcode):
	item=frappe.db.get_list('Item', 'type ', filters={"item_code": itemcode})
	type=item[0].type
	Function=''
	if type=='Functional':
		Function=itemcode
	elif type == 'Sub functional':
		items = frappe.db.get_list('Item', 'parent_item ', filters={"item_code": itemcode})
		Function=items[0].parent_item
	elif type=='Equipment':
		items = frappe.db.get_list('Item', 'parent_item ', filters={"item_code": itemcode})
		parent_item=frappe.db.get_list('Item', 'parent_item ', filters={"item_code": items[0].parent_item})
		Function=parent_item[0].parent_item
	else:
		items = frappe.db.get_list('Item', 'parent_item ', filters={"item_code": itemcode})
		parent_item=frappe.db.get_list('Item', 'parent_item ', filters={"item_code": items[0].parent_item})
		parent_parent_item=frappe.db.get_list('Item', 'parent_item ', filters={"item_code": parent_item[0].parent_item})
		Function=parent_parent_item[0].parent_item
	return Function

def getDefectCategory(itemcode):
	item=frappe.db.get_list('Item', 'type ', filters={"item_code": itemcode})
	type=item[0].type
	Function=''
	if type=='Functional':
		Function=itemcode
	elif type == 'Sub functional':
		Function=itemcode
	elif type=='Equipment':
		items = frappe.db.get_list('Item', 'parent_item ', filters={"item_code": itemcode})
		Function=items[0].parent_item
	else:
		items = frappe.db.get_list('Item', 'parent_item ', filters={"item_code": itemcode})
		parent_item=frappe.db.get_list('Item', 'parent_item ', filters={"item_code": items[0].parent_item})
		Function=parent_item[0].parent_item
	return Function

def get_columns():
	columns = [
		_("Generated From") + "::200", 
		_("Function") + "::200",
		_("Category")+ "::120",
		_("Item") + "::120",
		_("Defect Description") + "::120",
		_("Risk Level") + "::120",
		_("Status") + "::120",
		_("Entry Date") + "::120",
		_("Target Date") + "::120",
		_("Completion Date") + "::120",
		_("Shore required") + "::200",
		_("Spares/ stores required reference") + "::200",
		
	]
	return columns

def get_conditions(filters):
	conditions = ""
	if filters.get("item"): conditions += " and item_code=%(item)s"
	if filters.get("entry_to_date"): conditions += " and failure_date <= %(entry_to_date)s"
	if filters.get("entry_from_date"): conditions += " and failure_date>=%(entry_from_date)s"
	if filters.get("target_to_date"): conditions += " and target_date <= %(target_to_date)s"
	if filters.get("target_from_date"): conditions += " and target_date>=%(target_from_date)s"
	if filters.get("repair_status"): conditions += " and repair_status=%(repair_status)s"

	return conditions

def get_defect_list(conditions, filters):
	defect_list = frappe.db.sql("""select defect_list_from ,item_code,description,risk_level,
			repair_status,CAST(failure_date AS char(10)) as failure_date,
			CAST(target_date AS char(10)) as target_date,
			CAST(completion_date AS char(10)) as completion_date,
			shore_assistance_required,spares_required_reference 
			from `tabAsset Repair`  where docstatus = 1 %s """ %
		conditions, filters, as_dict=1)
	return defect_list