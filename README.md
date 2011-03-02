[jQuery Delegate](https://github.com/aglemann/jquery-delegate/) - Delegation for your jQuery UI widgets
==

jQuery UI Widgets are great, except they are implicitly bound to elements in the DOM which makes them hard to delegate (with <code>.live()</code> for example);

One approach is to [wrap widget instances](http://enterprisejquery.com/2010/07/configuring-ui-widgets-and-interactions-with-live/) in delegates. Another approach is to curry the widget factory to product something that walks and talks like a widget but is actually a delegate:

	$.delegate('namespace.example_widget', {
		_create: function(){ ... }
	});

Just as with ui.widget the <code>.example_widget()</code> function is now available to the jQuery object:

	$('.some_selector').example_widget();	

And the widget object has access to the selector used for initialization – as <code>this._selector)</code> – allowing you to do:

	$.delegate('namespace.example_widget', {
		_create: function(){
			// the 'this' context is the widget instance
			// this.element is always the window
			$(this._selector).live('focus.example_widget', this, this._focus);
		},
		_focus: function(event){
			// the 'this' context is the element (result of the selector)
			// event.data is the widget instance
			// so event.data.options is the options object
		},
		destroy: function(){
			// you get it
			$(this._selector).die('focus.example_widget');
		}
	});

Benefits
--

* Super lightweight - about 20 lines of raw code.
* Super high performance - delegates are much lighter on browser resources and CPU.
* More responsibe UI - instantiate your delegates anytime, no need to wait for <code>document.ready()</code>.

Those Things That Aren't Benefits
--

* Only intended for widgets that do not need to manipulate the DOM on creation. For that, better use plain old widgets.

How To Get Started
--

The plugin uses Qunit for tests. To run the tests you'll need to initialize the submodule:

	git submodule init
	git submodule update

Then load the <code>test.html</code> page in your web browser (you'll need an internet connection).