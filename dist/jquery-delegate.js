/*! jQuery Delegate - v0.0.1 - 2013-03-05
* Copyright (c) 2013 Aeron Glemann (http://www.electricprism.com/aeron); Licensed MIT */

define('jquery-delegate',[
    'jquery',
    'jquery-ui'
], function($) {
    $.delegate = function(name, base, prototype) {
        var names = name.split('.'),
            namespace = names[0],
            widgetName = names[1];            

        $.fn[widgetName] = function(options) {
            var isMethodCall = typeof options === 'string',
                returnValue;
                
            // Delegation only works for selectors, not existing DOM nodes.
            if (this.selector) {
                var selector = this.selector,
                
                    // Create a unique widget instance based on the selector.
                    uid = widgetName + selector.replace(/\.|\s/g, '_'),
                    doc = $(document),
                    instance = doc.data(uid);

                // If the widget hasn't been instantiated, create it.
                if (!instance) {
                    $.widget(namespace + '.' + uid, base, prototype);
                    
                    // Expose the selector to the widget instance
                    // which will be needed in order to delegate events.
                    $[namespace][uid].prototype._selector = selector;
                }
                returnValue = doc[uid].apply(doc, arguments);
            }
            return isMethodCall ? returnValue : this;
        };
    };   
});