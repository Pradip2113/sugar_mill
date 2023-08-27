# Copyright (c) 2023, Quantbit and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class TripSheet(Document):
	@frappe.whitelist()
	def hdata(self):
		doc = frappe.get_all('H and T Contract', filters={'name': self.transporter_code}, fields={'name','gang_type','vehicle_no','transporter_code','harvester_code','transporter_name','harvester_name','trolly_1','trolly_2','total_vehicle','vehicle_type'})
		for s in doc:
			self.transporter_name = s.transporter_name
			self.transporter = s.transporter_code
			self.harvester_code = s.harvester_code
			self.harvester_name = s.harvester_name
			self.vehicle_type = s.vehicle_type
			self.vehicle_number = s.vehicle_no
			self.tolly_1 = s.trolly_1
			self.tolly_2 = s.trolly_2
			self.gang_type = s.gang_type
   
	@frappe.whitelist()
	def carthdata(self):
		vehireg = frappe.get_all('Vehicle Registration item',filters={'cart_no': self.cartno}, fields={'parent','driver_name','cart_no','season'})
		for m in vehireg:
			# frappe.msgprint(str(m.driver_name +"____________"+m.parent+"-----------"+m.season))
			htget = frappe.get_all('H and T Contract', filters={'old_no': m.parent}, fields={'name','gang_type','vehicle_no','circle','old_no','transporter_name','harvester_code','harvester_name','vehicle_type','transporter_code'})
			for j in htget:
				self.transporter_name = j.transporter_name
				self.harvester_code = j.harvester_code
				self.harvester_name = j.harvester_name
				self.vehicle_type = j.vehicle_type
				self.vehicle_number = j.vehicle_no
				self.transporter_code = j.name
				self.transporter = j.transporter_code
				self.gang_type = j.gang_type
				
				
	def before_save(self):
		doc=frappe.db.get_list("Branch",filters={"branch" : self.branch},
											fields=["name","trip_sheet_no"])
		if(int(self.tripsheet_no)==int(0)):
			self.tripsheet_no=int(doc[0].get("trip_sheet_no"))+1
			frappe.db.set_value("Branch",doc[0].get("name"),"trip_sheet_no",self.tripsheet_no)

  
  
  