# Copyright (c) 2013, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

def execute(filters=None):
	columns, data = [], []
	return columns, data


def get_runninhrsbased_items():
	items = frappe.db.get_list('Item', 'item_code', filters={"running_hour_based": 1})
	return items