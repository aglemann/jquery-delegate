define([
    'src/jquery-delegate'
], function() {    
    var _uid = function(str){ // helper to duplicate uid creation of plugin
    	return str.replace(/\.|\s/g, '_');
    }

    var namespace = 'ui',
    	widgetName = 'widget',
    	instances;

    module('core', {
    	setup: function(){
    		$.delegate(namespace + '.' + widgetName, {
    			_create: function(){
    				instances = 0;
    			},
    			_init: function(){ 
    				instances++; 
    			} 
    		});
    	},
    	teardown: function(){
    		delete $.fn[widgetName];
    	}
    });

    test('create delegate', function(){
    	ok($.isFunction($.fn[widgetName]), 'widget added to jQuery object');
    });

    test('instantiate delegate', function(){
    	var selector = '.class',
    		uid = _uid(widgetName + selector), // widget_class
    		$collection = $(selector),
    		$this = $collection[widgetName](); // instantiate widget
	
    	ok($.data(document, uid), 'instance added to data for document');
    	equal($collection.selector, selector, 'collection has jQuery selector property');
    	equal($this, $collection, 'function returns jQuery context');
    	equal($.data(document, uid)._selector, selector, 'selector property set in instance');

    	// cleanup
    	$collection[widgetName]('destroy');
    	ok(!$.data(window, uid), 'instance removed from data for window on destroy');
    });

    test('failed instance with no selector', function(){
    	var	$collection = $(document.getElementsByTagName('div')),
    		$this = $collection[widgetName]();
	
    	ok(!$collection.selector, 'collection has no selector property');
    	equal($this, $collection, 'jQuery context returned even though widget was not instantiated');
    });

    test('multiple instances', function(){
    	var selector1 = '#id',
    		uid1 = _uid(widgetName + selector1), // widget#id
    		selector2 = '.class',
    		uid2 = _uid(widgetName + selector2); // widget_class

    	$(selector1)[widgetName]();
    	ok($.data(document, uid1), 'first instance added to data for document');
	
    	$(selector2)[widgetName]();
    	ok($.data(document, uid2), 'second instance added to data for document');	

    	equal($.data(document, uid1)._selector, selector1, 'selector property set correctly for instance');
    	equal($.data(document, uid2)._selector, selector2, 'selector property set correctly for instance');

    	// cleanup
    	$(selector1)[widgetName]('destroy');
    	ok(!$.data(document, uid1), 'first instance removed from data for document on destroy');
	
    	$(selector2)[widgetName]('destroy');
    	ok(!$.data(document, uid2), 'second instance removed from data for document on destroy');	
    });

    test('re-instancing and method calls', function(){
    	var selector = '.class',
    		uid = _uid(widgetName + selector); // widget_class

    	$(selector)[widgetName]();
    	ok($.data(document, uid), 'instance added to data for document');
    	equal(instances, 1, 'instance count checks');

    	$(selector)[widgetName](); // reinstance
    	equal(instances, 2, 'instance count incremented');

    	$(selector)[widgetName]('disable'); // method call does not reinstance
    	ok($.data(document, uid).options.disabled, 'method call executed correctly');
    	equal(instances, 2, 'instance count unchanged');

    	$(selector)[widgetName]({ disabled: false }); // reinstance with options
    	ok(!$.data(document, uid).options.disabled, 'option set correctly');
    	equal(instances, 3, 'instance count incremented');
	
    	// cleanup
    	$(selector)[widgetName]('destroy');
    	ok(!$.data(document, uid), 'instance removed from data for document on destroy');
    });

    test('multiple widgets', function(){
    	var namespace2 = namespace + 2,
    		widgetName1 = widgetName,
    		widgetName2 = widgetName + 2,		
    		selector1 = '#id',
    		selector2 = '.class',
    		uid1 = _uid(widgetName1 + selector1), // widget#id
    		uid2 = _uid(widgetName2 + selector2), // widget2_class
    		value;
		
    	$.delegate(namespace2 + '.' + widgetName2, { // new widget2	
    		_create: function(){
    			value = 2;
    		}
    	});
	
    	$(selector1)[widgetName1](); // instantiate widget
    	$(selector2)[widgetName2](); // instantiate widget2
	
    	ok($.data(document, uid1), 'first widget added to data for document');
    	equal($.data(document, uid1)._selector, selector1, 'selector property set correctly for instance');
    	equal(instances, 1, 'prototype is correct for instance');
	
    	ok($.data(document, uid2), 'second widget added to data for document');
    	equal($.data(document, uid2)._selector, selector2, 'selector property set correctly for instance');
    	equal(value, 2, 'prototype is correct for instance');
	
    	// cleanup
    	$(selector1)[widgetName1]('destroy');
    	ok(!$.data(document, uid1), 'first widget removed from data for document on destroy');
	
    	$(selector2)[widgetName2]('destroy');
    	ok(!$.data(document, uid2), 'second widget removed from data for document on destroy');
	
    	delete $.fn[widgetName2];
    });

    test('widget methods', function(){
    	var widgetName2 = widgetName + 2,		
    		selector = '.class',
    		returnValues = {
    		    array: [1, 2, 3],
    		    collection: document.getElementsByTagName('div'),
    		    number: 1,
    		    object: {},
    		    string: 'string'
    		},
    		proto = {};
		
    	$.each(returnValues, function(prop, val) {
    	    proto[prop] = function() {
    	        return returnValues[prop];
    	    }
    	});
    	$.delegate(namespace + '.' + widgetName2, proto);
		
    	$(selector)[widgetName2](); // instantiate widget	
    	$.each(returnValues, function(prop, val) {
    	    deepEqual($(selector)[widgetName2](prop), val, 'public method returns value of type "' + prop + '"');
    	});
	
    	// cleanup
    	$(selector)[widgetName2]('destroy');
    	delete $.fn[widgetName2];
    });
});