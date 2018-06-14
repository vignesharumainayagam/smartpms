from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"label": _("Equipments"),
			"items": [
				{

					"type": "doctype",
					"label":_("Subjects"),
					"name": "Subjects",
				
				},
				{

					"type": "doctype",
					"label":_("Chapters"),
					"name": "Chapters",
				
				},
				{

					"type": "doctype",
					"label":_("Section"),
					"name": "Section",
				
				},								
				{
					"type": "doctype",
					"name": "Questions",
					
				},

			]
		},

	]




