# Copyright (c) 2023, Quantbit and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class SlipBoyAssignment(Document):

	@frappe.whitelist()
	def before_save(self):
		list=[]
		doc = frappe.db.get_list("User Permission",
												filters={"user": self.slip_boy,},
												fields=["for_value","name"],)
		for d in self.get("village_table_sb"):
			list.append(d.village)
		values_in_first_list = set(item['for_value'] for item in doc)
		items_not_in_first_list = [value for value in list if value not in values_in_first_list]
		filtered_list = [item for item in doc if item['for_value'] not in list]
		
		for x in items_not_in_first_list:
			user_permission = frappe.new_doc('User Permission')
			user_permission.user = self.slip_boy
			user_permission.allow = 'Village'
			user_permission.for_value = x
			user_permission.insert()
			user_permission.save()
   
		for m in filtered_list:
			doc = frappe.db.get_list("User Permission",
												filters={"user": self.slip_boy, "for_value": m.for_value},
												fields=["name"],)
			for k in doc:
				permission_doc = frappe.get_doc("User Permission", k.name)
				if permission_doc:
					permission_doc.delete()


	@frappe.whitelist()
	def on_trash(self):
		for m in self.get("village_table_sb"):
			doc = frappe.db.get_list("User Permission",
												filters={"user": self.slip_boy, "for_value": m.village},
												fields=["name"],)
			for k in doc:
				permission_doc = frappe.get_doc("User Permission", k.name)
				if permission_doc:
					permission_doc.delete()
     
     
	# @frappe.whitelist()
	# def before_save(self):
	# 	for s in self.get("villages"):
	# 		user_permission = frappe.new_doc('User Permission')
	# 		user_permission.user = self.user
	# 		user_permission.allow = 'Village'
	# 		user_permission.for_value = s.village
	# 		user_permission.insert()
	# 		user_permission.save()



	# s=frappe.new_doc('User Permission')
	# s.user=doc.user
	# s.allow="Village"
	# s.for_value=doc.village
	# s.insert()