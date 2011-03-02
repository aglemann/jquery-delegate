module('core', {
	setup: function(){
		$.delegate('ui.test');
	},
	teardown: function(){
		delete $.fn.test;
		delete $.ui._test;
	}
});

test('create delegate', function(){
	ok($.isFunction($.fn.test), 'widget added to jQuery object');
	ok($.isFunction($.ui._test), 'curried widget added to UI namespace');
});

test('instantiate delegate', function(){
	$('.test').test();
	ok($.data(window, '_test'), 'widget added to data for window')
	equal($(window).data('_test')._selector, '.test', 'selector set in instance');
	
	var div = document.getElementById('#qunit-fixture');
	raises($(div).test(), 'cannot instantiate collection, only string selector');
	
	$('#test').test();
	equal($(window).data('_test')._selector, '.test', 'widget already instantiated, selector not changed');	
});

test('destroy / recreate instance', function(){
	$('.test').test();
	$(window).test('destroy');
	ok(!$.data(window, '_test'), 'widget removed from data for window')
	
	$('#test').test();
	equal($(window).data('_test')._selector, '#test', 'selector changed on new instance');	
});

