// Copyright (c) 2023, Quantbit and contributors
// For license information, please see license.txt

frappe.ui.form.on('Diseal Sale Item', {
    onload: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, 'item_code', '30800010');
        refresh_field('item_code');
    }
});


frappe.ui.form.on('Diesel Sale', {
    before_submit: function(frm) {
        frm.call({
            method:'salesinvoice',//function name defined in python
            doc: frm.doc, //current document
        });
        
    }
});

// frappe.ui.form.on('Diesel Sale item', {
// 	qty: function(frm,cdt, cdn) {
// 		var k =cdt
// 		var qty=frm.doc.qty
// 		var rate=frm.doc.rate
// 		var amount= qty*rate
// 		frm.set_value("amount", amount);
//     refresh_field("amount");
// 	}
// });



frappe.ui.form.on('Diseal Sale Item', {
	qty: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
		var qty = parseFloat(child.qty);
		var rate = parseFloat(child.rate);
		var amount = qty * rate;
	
		// Set the value in the child table
		frappe.model.set_value(cdt, cdn, 'amount', amount);
	
		// Refresh the field in the UI
		refresh_field('amount');
	}
	
});



frappe.ui.form.on('Diesel Sale', {
    refresh: function(frm) {
        $('.layout-side-section').hide();
        $('.layout-main-section-wrapper').css('margin-left', '0');
    }
});