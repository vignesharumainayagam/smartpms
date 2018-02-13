# -*- coding: utf-8 -*-
# Copyright (c) 2018, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class SpareGroup(Document):
	pass
	# def on_update(self):	
	# 	new_doc = {'doctype': 'Item', 'parent_item': self.parent, 'item_group': item_group, 'is_fixed_asset': is_fixed_asset, 'asset_category': asset_category, 'is_group': is_group, 'type': element_type, 'stock_uom': stock_uom}
	# 		new_item = frappe.get_doc(new_doc)
	# 		new_item.insert()
