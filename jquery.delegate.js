/*
 * Delegation for your jQuery UI widgets
 * https://github.com/aglemann/jquery-delegate/
 * Copyright (c) 2011 Aeron Glemann
 * Version: 1.0 (02/29/2011)
 * Licensed under the MIT licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * Requires: jQuery UI v1.8 or later
 */
(function($){
	$.delegate = function(name, base, prototype){
		var names = name.split('.'),
			namespace = names[0],
			name = names[1];

		$.fn[name] = function(){			
			if (this.selector){ // only string selectors
				var selector = this.selector,
					uid = name + selector.replace(/\.|\s/g, '_'),
					$window = $(window),
					instance = $window.data(uid);

				if (!instance){
					$.widget(namespace + '.' + uid, base, prototype);
					$[namespace][uid].prototype._selector = selector;
				}

				$window[uid].apply($window, arguments);
			}
			return this; 
		}
	}	
})(jQuery);