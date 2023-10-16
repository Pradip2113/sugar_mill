# Copyright (c) 2023, Quantbit and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class DieselSale(Document):
	
	@frappe.whitelist()
	def salesinvoice(self):
		# sales_invoice= frappe.get_doc({"doctype":"Sales Invoice", "description": "test"})
		# sales_invoice.insert(ignore_permissions=True)
		# sales_invoice.save()
		for r in self.get('diseal_sale_item'):
			doc = frappe.new_doc('Sales Invoice')
			doc.customer =self.party_name 
			doc.sale_type="Diesel Sale"
			doc.naming_series='ACC-SINV-.YYYY.-'
			doc.posting_date=self.date
			doc.branch=self.plant
			doc.due_date=self.date
			doc.debit_to=self.debit_to
			doc.append(
					"items",
					{
						"item_code": r.item_code,
						"qty": r.qty,
						"rate": r.rate,
						"amount": ((r.amount)),
					},)
			doc.insert()
			frappe.msgprint('sales invoice updated')
			doc.save()
			
			
   
