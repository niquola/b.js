var $ = require;
var build = '';
var index = {};

var resolve = function (name) {
	if (index[name]) {
		return;
	}
  index[name] = true;
	function define(deps, callback) {
		return {
			defenition: callback,
			dependencies: deps
		};
	}
	var path = 'test/path1/' + name + '.js';
	$('path').exists(path, function (exists) {
		if (exists) {
			$('fs').readFile(path, 'utf8', function (err, data) {
				var module = eval(data);
				module.dependencies.forEach(function (id) {
					if (!index[id]) {
						resolve(id);
					}
				});
				var deps = module.dependencies.map(function (dep) {
					return 'dep["' + dep + '"]';
				}).join(',');
				build = "\n//"+name +"\ndep['" + name + "']=(" + module.defenition.toString() + "\n)(" + deps + ");\n" + build;
				console.log('==================');
				console.log(build);
			});
		} else {
			console.log('File not exists:' + path);
		}
	});
};

var require = function (dependencies, callback) {
	var resolved_deps = [];
	dependencies.forEach(function (dep) {
		resolved_deps.push(resolve(dep));
	});
};

require(['a'], function () {});
