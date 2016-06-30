export default function() {

	var modules = {};

	modules.isChiQueryNodes = function(nodes) {
		var bool = false;
		if (typeof nodes === 'object') {
			if (nodes.isChiQuery) bool = true;
		}
		return bool;
	};

	modules.isNodeList = function(nodes) {
		var stringRepr = Object.prototype.toString.call(nodes);
		return typeof nodes === 'object' &&
			/^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
			(typeof nodes.length === 'number') &&
			(nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
	};

	modules.isNodeItem = function(node) {
		return typeof node === "object" && typeof node.nodeName==="string" && typeof node.nodeType === "number";
	};

	modules.nodesToArray = function(nodes) {
		var nodesArr = [];
		for (var _i = 0; _i < nodes.length; _i++) {
			nodesArr.push(nodes[_i]);
		}
		return nodesArr;
	};

	return modules;

}
