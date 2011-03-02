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
	$.delegate = function(name, prototype){
		var names = name.split('.'),
			namespace = names[0],
			name = names[1],
			_name = '_' + name;

		$.widget(namespace + '.' + _name, prototype);

		$.fn[name] = function(){			
			var $window = $(window),
				instance = $window.data(_name);

			if (!instance){
				if (!this.selector)
					return $.error('cannot initialize delegate on collection, must use string selector');
				$[namespace][_name].prototype._selector = this.selector;
			}

			$window[_name].apply($window, arguments);
		}
	}	
})(jQuery);