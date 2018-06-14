# -*- coding: utf-8 -*-
# Copyright (c) 2015, ESS LLP and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.utils import cint

@frappe.whitelist()
def get_feed():
	"""get feed"""
	total = frappe.db.sql("""
			select count(*) from `tabAsset Maintenance Task`
			""")
	result = frappe.db.get_list('Asset Maintenance Task',
	 			fields=['name', 'maintenance_task', 'maintenance_type', 'maintenance_status', 'parent'], 
	 			# filters={"running_hour_based": 1}
	 			)

	return {'result': result, 'total': total}
