export default (function(global) {
	if (!('window' in global && 'document' in global))
		return;

	// Document.querySelectorAll method
	// http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
	// Needed for: IE7-
	if (!document.querySelectorAll) {
		document.querySelectorAll = function(selectors) {
			var style = document.createElement('style'), elements = [], element;
			document.documentElement.firstChild.appendChild(style);
			document._qsa = [];

			style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
			window.scrollBy(0, 0);
			style.parentNode.removeChild(style);

			while (document._qsa.length) {
				element = document._qsa.shift();
				element.style.removeAttribute('x-qsa');
				elements.push(element);
			}
			document._qsa = null;
			return elements;
		};
	}

	// Document.querySelector method
	// Needed for: IE7-
	if (!document.querySelector) {
		document.querySelector = function(selectors) {
			var elements = document.querySelectorAll(selectors);
			return (elements.length) ? elements[0] : null;
		};
	}

	// Element.matches
	// https://developer.mozilla.org/en/docs/Web/API/Element/matches
	// Needed for: IE, Firefox 3.6, early Webkit and Opera 15.0
	// Use msMatchesSelector(selector) for IE
	// Use oMatchesSelector(selector) for Opera 15.0
	// Use mozMatchesSelector(selector) for Firefox 3.6
	// Use webkitMatchesSelector(selector) for early Webkit
	// Use polyfill if no matches() support, but querySelectorAll() support
	if ('Element' in global && !Element.prototype.matches) {
		if (Element.prototype.msMatchesSelector) {
			Element.prototype.matches = Element.prototype.msMatchesSelector;
		} else if (Element.prototype.oMatchesSelector) {
			Element.prototype.matches = Element.prototype.oMatchesSelector;
		} else if (Element.prototype.mozMatchesSelector) {
			Element.prototype.matches = Element.prototype.mozMatchesSelector;
		} else if (Element.prototype.webkitMatchesSelector) {
			Element.prototype.matches = Element.prototype.webkitMatchesSelector;
		} else if (document.querySelectorAll) {
			Element.prototype.matches = function matches(selector) {
				var matches = (this.document || this.ownerDocument).querySelectorAll(selector),
					i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
		}
	}

	// IE<9 indexOf polyfill
	// https://gist.github.com/revolunet/1908355#file-indexof-js
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(elt /*, from*/) {
			var len = this.length >>> 0;
			var from = Number(arguments[1]) || 0;
			from = (from < 0)
				? Math.ceil(from)
				: Math.floor(from);
			if (from < 0)
				from += len;
			for (; from < len; from++) {
				if (from in this &&
					this[from] === elt)
					return from;
			}
			return -1;
		};
	}

	/**
	 * Polyfill for Object.keys
	 *
	 * @see: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
	 */
	if (!Object.keys) {
		Object.keys = (function () {
			var hasOwnProperty = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
				dontEnums = [
					'toString',
					'toLocaleString',
					'valueOf',
					'hasOwnProperty',
					'isPrototypeOf',
					'propertyIsEnumerable',
					'constructor'
				],
				dontEnumsLength = dontEnums.length;

			return function (obj) {
				if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

				var result = [];

				for (var prop in obj) {
					if (hasOwnProperty.call(obj, prop)) result.push(prop);
				}

				if (hasDontEnumBug) {
					for (var i=0; i < dontEnumsLength; i++) {
						if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
					}
				}
				return result;
			}
		})()
	};
}(self));
