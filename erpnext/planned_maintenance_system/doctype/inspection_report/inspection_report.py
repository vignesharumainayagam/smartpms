# -*- coding: utf-8 -*-
# Copyright (c) 2018, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class InspectionReport(Document):
	# pass

	def after_insert(self):
		for x in self.table_9:
			new_doc = {'doctype': 'Asset Repair', 'asset_name': x.item , 'failure_date': self.inspection_date, 'description': x.defect_description}
			new_asset_repair = frappe.get_doc(new_doc)
			new_asset_repair.insert()