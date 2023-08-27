// Copyright (c) 2023, Quantbit and contributors
// For license information, please see license.txt

frappe.ui.form.on('Trip Sheet', {
	transporter_code: function(frm) {frm.call({
			method:'hdata',//function name defined in python
			doc: frm.doc, //current document
		});
		
	}
});

frappe.ui.form.on('Trip Sheet', {
	cartno: function(frm) {frm.call({
			method:'carthdata',//function name defined in python
			doc: frm.doc, //current document
		});
		
	}
});

frappe.ui.form.on('Trip Sheet', {
	setup: function(frm) {
		frm.set_query("plot_no", function(doc) {
			return {
				filters: [
				    ['Crop Harvesting', 'season', '=', frm.doc.season],
				]
			};
		});
	},
})

