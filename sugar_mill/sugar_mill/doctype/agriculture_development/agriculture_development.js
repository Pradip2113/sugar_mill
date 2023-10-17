
frappe.ui.form.on('Agriculture Development', {
    refresh: function(frm) {
            frm.set_query("cane_registration_id", function() { // Replace with the name of the link field
                return {
                    filters: [
                        ["Cane Master", "season", '=', frm.doc.season] // Replace with your actual filter criteria
                    ]
                };
            });
        }
    });


frappe.ui.form.on('Agriculture Development', {
	update(frm) {
	    // debugger
        frm.clear_table("agriculture_development_item")
		frm.refresh_field("agriculture_development_item")
	    var basel = "",preeathing ="",earth="",rainy="",ratoon1="",ratoon2="";
        var fixedarea = Number(frm.doc.development_area.toFixed(0))
        var guntacal = (frm.doc.development_area - fixedarea)
        var guntacalfix = Number(guntacal.toFixed(2))*1
        var quotent = 0

        if (guntacalfix >= 0.01 && guntacalfix <= 0.10) {
            quotent = 0;
          } else if (guntacalfix >= 0.11 && guntacalfix <= 0.20) {
            quotent =  0.25;
          } else if (guntacalfix >= 0.21 && guntacalfix <= 0.30) {
            quotent =  0.50;
          } else if (guntacalfix >= 0.31 && guntacalfix <= 0.39) {
            quotent = 0.75;
          } else if (guntacalfix >= 0.40) {      
            frappe.throw( "Invalid input. The Gunta should be between 0.01 and 0.40.")
          }
          else{
            quotent = 0;
          }

        var areagunta = ((fixedarea*40)+(quotent*40))/40
        
		var checkedB = frm.get_field('basel').get_value();
        if (checkedB) 
        {
           	basel = "Basel";
        }
        else 
        {
            basel = "False";
        }
        
        var checkedP = frm.get_field('pre_earthing').get_value();
        if (checkedP) 
        {
           	preeathing = "Pre-Earth";
        }
        else 
        {
            preeathing = "False";
        }
        
        var checkedE = frm.get_field('earth').get_value();
        if (checkedE) 
        {
           	earth = "Earthing";
        }
        else 
        {
            earth = "False";
        }
        
        var checkedR = frm.get_field('rainy').get_value();
        if (checkedR) 
        {
           	rainy = "Rainy";
        }
        else 
        {
            rainy = "False";
        }
        var checkedRt1 = frm.get_field('ratoon_1').get_value();
        if (checkedRt1) 
        {
            ratoon1 = "Ratoon 1";
        }
        else 
        {
            ratoon1 = "False";
        }
        var checkedRt2 = frm.get_field('ratoon_2').get_value();
        if (checkedRt2) 
        {
            ratoon2 = "Ratoon 2";
        }
        else 
        {
            ratoon2 = "False";
        }
      
       	frm.call	({
			method:"Calculate_Fertilizer",
			doc:frm.doc,
			args:{
				doctype:"Agriculture Development",
				basel:basel,
				preeathing:preeathing,
				earth:earth,
				rainy:rainy,
                ratoon1:ratoon1,
                ratoon2:ratoon2,
                croptype : frm.doc.crop_type,
                cropvariety : frm.doc.crop_variety,
				area:parseFloat(frm.doc.development_area),
                areafixed:fixedarea,
                areagunta:areagunta
				},
			callback: function(r) {
					// frappe.msgprint("Loaded")
					frm.refresh_field('table_9');
			}
		})
	
	},
    refresh(frm){
        // frm.trigger("make_delivery_challan")
        frm.trigger("make_sales_order")
    },
    make_sales_order(frm){
        // if(frm.doc.docstatus === 1)
        // {
            
                frm.add_custom_button(__("Sales Order"),() => {
                    if (frm.doc.sales_type == "Fertilizer")
                        {
                            frappe.model.open_mapped_doc({
                            method:"sugar_mill.sugar_mill.doctype.agriculture_development.agriculture_development.make_sales_order",
                            frm:frm
                    })}
                    if (frm.doc.sales_type != "Fertilizer")
                    {
                        frappe.model.open_mapped_doc({
                        method:"sugar_mill.sugar_mill.doctype.agriculture_development.agriculture_development.make_nofarti",
                        frm:frm
                })}
                },__("Make")
                )
        // }
    //     frm.add_custom_button(__("Delivery Challan"),() => {
    //     debugger
    //         frm.call	({
	// 		method:"make_delivery_challan",
	// 		doc:frm.doc,
	// 		args:{
	// 			frm:frm
	// 			},
	// 		callback: function(r) {
	// 				frappe.msgprint("Loaded")
					
	// 		}
	// 	})
    // },__("Make"))
    }

});

frappe.ui.form.on('Agriculture Development', {
    development_area: function(frm) {
        frm.call({
            method:'area_val',//function name defined in python
            doc: frm.doc, //current document
        });
        
    }
});

// frappe.ui.form.on('Agriculture Development', {
//     after_save: function(frm) {
//         frm.call({
//             method:'set_tax_temp',//function name defined in python
//             doc: frm.doc, //current document
//         });
        
//     }
// });


/*************************************** Vikas Work *************************************************************/
// frappe.ui.form.on('Agriculture Development', {
//     sales_type: function(frm) {
//         // frm.clear_table("agriculture_development_item")
// 		frm.refresh_field('agriculture_development_item')
//         frm.call({
//             method:'hide_basel_column',//function name defined in python
//             doc: frm.doc, //current document
//         });
        
//     }
// });

// frappe.ui.form.on('Agriculture Development', {
//     refresh: function (frm) {
//         frm.fields_dict['agriculture_development_item'].grid.get_field('basel').get_query = function (doc) {
//             if (doc.sales_type === 'Fartilizer') {
//                 return { hidden: 1 };
//             }
//         };
//     }
// });

frappe.ui.form.on("Agriculture Development Item2", 
    "qty", function(frm, cdt, cdn) {
     var d = locals[cdt][cdn];
     if(d.qty >= 0 && d.rate >= 0){
        var result = ((d.qty * d.rate)).toFixed(2);
        frappe.model.set_value(cdt, cdn, 'amount', result);
    }
});
frappe.ui.form.on("Agriculture Development Item2", 
    "rate", function(frm, cdt, cdn) {
     var d = locals[cdt][cdn];
     if(d.qty >= 0 && d.rate >= 0){
        var result = ((d.qty * d.rate)).toFixed(2);
        frappe.model.set_value(cdt, cdn, 'amount', result);
    }
});



frappe.ui.form.on("Agriculture Development", {
    before_save:function(frm, cdt, cdn){
        debugger
    var d = locals[cdt][cdn];
    var total1 = 0.0;
    var bsl = 0.0;
    var pri = 0.0;
    var ear = 0.0;
    var ran = 0.0;
    var rot1 = 0.0;
    var rot2 = 0.0;
    debugger
    frm.doc.agriculture_development_item.forEach(function(d) { total1 += parseFloat(d.qty); });
    frm.doc.agriculture_development_item.forEach(function(d) { bsl += parseFloat(d.basel); });
    frm.doc.agriculture_development_item.forEach(function(d) { pri += parseFloat(d.pre_earthing); });
    frm.doc.agriculture_development_item.forEach(function(d) { ear += parseFloat(d.earth); });
    frm.doc.agriculture_development_item.forEach(function(d) { ran += parseFloat(d.rainy); });
    frm.doc.agriculture_development_item.forEach(function(d) { rot1 += parseFloat(d.ratoon_1); });
    frm.doc.agriculture_development_item.forEach(function(d) { rot2 += parseFloat(d.ratoon_2); });
    frm.set_value("total", total1); frm.set_value("basel_total",bsl); frm.set_value("pre_earthing_total",pri);
    frm.set_value("earth_total",ear); frm.set_value("rainy_total",ran); frm.set_value("ratoon_1_total",rot1);
    frm.set_value("ratoon_2_total",rot2);
    refresh_field("total"); refresh_field("basel_total"); refresh_field("pre_earthing_total"); refresh_field("earth_total");
    refresh_field("rainy_total"); refresh_field("ratoon_1_total"); refresh_field("ratoon_2_total");
  },
  update:function(frm, cdt, cdn){
    var d = locals[cdt][cdn];
    debugger
    var total1 = 0.0;
    var bsl = 0.0;
    var pri = 0.0;
    var ear = 0.0;
    var ran = 0.0;
    var rot1 = 0.0;
    var rot2 = 0.0;
    frm.doc.agriculture_development_item.forEach(function(d) { total1 += parseFloat(d.qty); });
    frm.doc.agriculture_development_item.forEach(function(d) { bsl += parseFloat(d.basel); });
    frm.doc.agriculture_development_item.forEach(function(d) { pri += parseFloat(d.pre_earthing); });
    frm.doc.agriculture_development_item.forEach(function(d) { ear += parseFloat(d.earth); });
    frm.doc.agriculture_development_item.forEach(function(d) { ran += parseFloat(d.rainy); });
    frm.doc.agriculture_development_item.forEach(function(d) { rot1 += parseFloat(d.ratoon_1); });
    frm.doc.agriculture_development_item.forEach(function(d) { rot2 += parseFloat(d.ratoon_2); });
    frm.set_value("total", total1); frm.set_value("basel_total",bsl); frm.set_value("pre_earthing_total",pri);
    frm.set_value("earth_total",ear); frm.set_value("rainy_total",ran); frm.set_value("ratoon_1_total",rot1);
    frm.set_value("ratoon_2_total",rot2);
    refresh_field("total"); refresh_field("basel_total"); refresh_field("pre_earthing_total"); refresh_field("earth_total");
    refresh_field("rainy_total"); refresh_field("ratoon_1_total"); refresh_field("ratoon_2_total");
  },
  agriculture_development_item_remove:function(frm, cdt, cdn){
    debugger
    var d = locals[cdt][cdn];
    var total1 = 0.0;
    var bsl = 0.0;
    var pri = 0.0;
    var ear = 0.0;
    var ran = 0.0;
    var rot1 = 0.0;
    var rot2 = 0.0;
    frm.doc.agriculture_development_item.forEach(function(d) { total1 += parseFloat(d.qty); });
    frm.doc.agriculture_development_item.forEach(function(d) { bsl += parseFloat(d.basel); });
    frm.doc.agriculture_development_item.forEach(function(d) { pri += parseFloat(d.pre_earthing); });
    frm.doc.agriculture_development_item.forEach(function(d) { ear += parseFloat(d.earth); });
    frm.doc.agriculture_development_item.forEach(function(d) { ran += parseFloat(d.rainy); });
    frm.doc.agriculture_development_item.forEach(function(d) { rot1 += parseFloat(d.ratoon_1); });
    frm.doc.agriculture_development_item.forEach(function(d) { rot2 += parseFloat(d.ratoon_2); });
    frm.set_value("total", total1); frm.set_value("basel_total",bsl); frm.set_value("pre_earthing_total",pri);
    frm.set_value("earth_total",ear); frm.set_value("rainy_total",ran); frm.set_value("ratoon_1_total",rot1);
    frm.set_value("ratoon_2_total",rot2);
    refresh_field("total"); refresh_field("basel_total"); refresh_field("pre_earthing_total"); refresh_field("earth_total");
    refresh_field("rainy_total"); refresh_field("ratoon_1_total"); refresh_field("ratoon_2_total");
  },
});



/*************************************** Vikas Work *************************************************************/