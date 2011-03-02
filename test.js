String.prototype._uid = function(){ // helper to duplicate uid creation of plugin
	return this.replace(/\.|\s/g, '_');
}

var namespace = 'ui',
	name = 'widget',
	instances;

module('core', {
	setup: function(){
		$.delegate(namespace + '.' + name, {
			_create: function(){
				instances = 0;
			},
			_init: function(){ 
				instances++; 
			} 
		});
	},
	teardown: function(){
		delete $.fn[name];
	}
});

test('create delegate', function(){
	ok($.isFunction($.fn[name]), 'widget added to jQuery object');
});

test('instantiate delegate', function(){
	var selector = '.class',
		uid = (name + selector)._uid(), // widget_class
		$collection = $(selector),
		$this = $collection[name](); // instantiate widget
	
	ok($.data(window, uid), 'instance added to data for window');
	equal($collection.selector, selector, 'collection has jQuery selector property');
	equal($this, $collection, 'function returns jQuery context');
	equal($.data(window, uid)._selector, selector, 'selector property set in instance');

	// cleanup
	$collection[name]('destroy');
	ok(!$.data(window, uid), 'instance removed from data for window on destroy');
});

test('failed instance with no selector', function(){
	var	$collection = $(document.getElementsByTagName('div')),
		$this = $collection[name]();
	
	ok(!$collection.selector, 'collection has no selector property');
	equal($this, $collection, 'jQuery context returned even though widget was not instantiated');
});

test('multiple instances', function(){
	var selector1 = '#id',
		uid1 = (name + selector1)._uid(), // widget#id
		selector2 = '.class',
		uid2 = (name + selector2)._uid(); // widget_class

	$(selector1)[name]();
	ok($.data(window, uid1), 'first instance added to data for window');
	
	$(selector2)[name]();
	ok($.data(window, uid2), 'second instance added to data for window');	

	equal($.data(window, uid1)._selector, selector1, 'selector property set correctly for instance');
	equal($.data(window, uid2)._selector, selector2, 'selector property set correctly for instance');

	// cleanup
	$(selector1)[name]('destroy');
	ok(!$.data(window, uid1), 'first instance removed from data for window on destroy');
	
	$(selector2)[name]('destroy');
	ok(!$.data(window, uid2), 'second instance removed from data for window on destroy');	
});

test('re-instancing and method calls', function(){
	var selector = '.class',
		uid = (name + selector)._uid(); // widget_class

	$(selector)[name]();
	ok($.data(window, uid), 'instance added to data for window');
	equal(instances, 1, 'instance count checks');

	$(selector)[name](); // reinstance
	equal(instances, 2, 'instance count incremented');

	$(selector)[name]('disable'); // method call does not reinstance
	ok($.data(window, uid).options.disabled, 'method call executed correctly');
	equal(instances, 2, 'instance count unchanged');

	$(selector)[name]({ disabled: false }); // reinstance with options
	ok(!$.data(window, uid).options.disabled, 'option set correctly');
	equal(instances, 3, 'instance count incremented');
	
	// cleanup
	$(selector)[name]('destroy');
	ok(!$.data(window, uid), 'instance removed from data for window on destroy');
});

test('multiple widgets', function(){
	var namespace2 = namespace + 2,
		name1 = name,
		name2 = name + 2,		
		selector1 = '#id',
		selector2 = '.class',
		uid1 = (name1 + selector1)._uid(), // widget#id
		uid2 = (name2 + selector2)._uid(), // widget2_class
		value;
		
	$.delegate(namespace2 + '.' + name2, { // new widget2	
		_create: function(){
			value = 2;
		}
	});
	
	$(selector1)[name1](); // instantiate widget
	$(selector2)[name2](); // instantiate widget2
	
	ok($.data(window, uid1), 'first widget added to data for window');
	equal($.data(window, uid1)._selector, selector1, 'selector property set correctly for instance');
	equal(instances, 1, 'prototype is correct for instance');
	
	ok($.data(window, uid2), 'second widget added to data for window');
	equal($.data(window, uid2)._selector, selector2, 'selector property set correctly for instance');
	equal(value, 2, 'prototype is correct for instance');
	
	// cleanup
	$(selector1)[name1]('destroy');
	ok(!$.data(window, uid1), 'first widget removed from data for window on destroy');
	
	$(selector2)[name2]('destroy');
	ok(!$.data(window, uid2), 'second widget removed from data for window on destroy');
	
	delete $.fn[name2];
});