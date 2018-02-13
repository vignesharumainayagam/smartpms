from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"label": _("Item"),
			"items": [
				{
					"type": "doctype",
					"name": "Item",
				},
				{
					"type": "doctype",
					"name": "Defect",
					
				},

			]
		},
		{
			"label": _("Asset"),
			"items": [
				{
					"type": "doctype",
					"name": "Asset",
				},
				{
					"type": "doctype",
					"name": "Asset Category",
				},
				{
					"type": "doctype",
					"name": "Maintenance Type",
				},
			]
		},
		{
			"label": _("Maintenance"),
			"items": [
				{
					"type": "doctype",
					"name": "Asset Maintenance Team",
				},
				{
					"type": "doctype",
					"name": "Asset Maintenance",
				},
				{
					"type": "doctype",
					"name": "Asset Maintenance Log",
				},
				{
					"type": "doctype",
					"name": "Asset Repair",
				},
				{
					"type": "doctype",
					"name": "Inspection Report",
				},
			]
		},
		{
			"label": _("Running Hours & Circulating Components"),
			"items": [
				{
					"type": "doctype",
					"name": "Running Hours Entry",
				},
				{
					"type": "doctype",
					"name": "Running Hours Log",
				},
				{
					"type": "doctype",
					"name": "Circulating Components",
				},
				{
					"type": "doctype",
					"name": "Circulating Components Log",
				},
				{
					"type": "doctype",
					"name": "Spare Group",
				},
				{
					"type": "doctype",
					"name": "Spare",
				},				
			]
		},
		{
			"label": _("Stock & Requisition"),
			"items": [
				{
					"type": "report",
					"is_query_report": True,
					"name": "Stock Balance",
					"doctype": "Stock Ledger Entry"
				},
				{
					"type": "doctype",
					"name": "Material Request",
				},
				{
					"type": "page",
					"name": "dashboard",
					"label": _("Dashboard"),
					"description": _("Dashboard")
				},
			]
		},
		{
			"label": _("Procedure"),
			"items": [
				{
					"type": "doctype",
					"name": "Procedure",
				},
			]
		},

	]




