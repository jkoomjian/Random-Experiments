var dmApp = angular.module('dmApp', []);


/**** Utils *****/
dmApp.generateKey = function() {
	//figure out a unique key for this matrix
	var rand = '';
	while (rand.length < 8)	{rand += String.fromCharCode(_.random(65, 90));}
	return rand.toLowerCase();
}

dmApp.getKeyFromUrl = function() {
	return window.location.hash.replace("#", "");
}

dmApp.containsData = function(ar) {
	return ar && ar.length;
}


/**** App Set Up *****/
dmApp.db_api_key = 'JPwG1i6dkxXo3_Jot1lg7OnpTu2lZ0nw';
dmApp.db_name = 'jkoomjian';
dmApp.db_collection = 'dm-prod1';
dmApp.db_url = 'https://api.mongolab.com/api/1/databases/'+dmApp.db_name+'/collections/'+dmApp.db_collection+'/?apiKey='+dmApp.db_api_key;
dmApp.id = dmApp.getKeyFromUrl();


/**** Controller *****/
dmApp.controller('matrixCtlr', function($scope, dmDBservice) {

	/**** Set Up Scope *****/
	$scope.criteria = [
						{name: 'Criteria One22', weight: 20},
						{name: 'Criteria Two22', weight: 10}
						];
	$scope.options = [
						{name: 'Option One33', values: [1, 2]},
						{name: 'Option Two44', values: [3, 4]}
						];

	/**** Set Totals *****/
	dmApp.setTotalCalc = function (option) {
		option.total = function() {
			var currTotal = 0, i = 0, weight, value;
			for (i; i<$scope.criteria.length; i++) {
				weight = $scope.criteria[i].weight;
				value = option.values[i];
				currTotal += weight * value;
			}
			return currTotal;
		}
	}
	dmApp.setTotals = function(options) {
		angular.forEach(options, function(option) {
			if (!option.total) dmApp.setTotalCalc(option);
		});
	}
	dmApp.setTotals($scope.options);


	/**** Watch For Changes *****/
	var _save = function (newCollection, oldCollection, scope) {
		if (!angular.equals(newCollection, oldCollection)) {
			dmDBservice.saveToDB(scope).success(function() {
				// console.log('success inserting row!');
			});
			return false;
		}
	}

	$scope.$watch(function(scope){ return scope.criteria; }, _save, true);
	$scope.$watch(function(scope){ return scope.options; }, _save, true);


	/**** Loading *****/
	angular.element(document).ready(function() {
		//check if there is any data we need to load
		if (dmApp.id) {
			dmDBservice.fetchFromDB().success(function (response) {
				if (dmApp.containsData(response.criteria) || dmApp.containsData(response.options)) {
					$scope.criteria = response.criteria;
					$scope.options = response.options;
					dmApp.setTotals($scope.options);
				}
			});
		} else {
			//get a key and insert
			dmApp.id = dmApp.generateKey();
			window.history.pushState({}, "", "#" + dmApp.id);
		}
	});


	/**** Controller Methods *****/
	$scope.addOption = function() {
		var vals = _.map( _.range($scope.criteria.length), function(num){return num*0;} );
		// var vals = _.range($scope.criteria.length);
		$scope.options.push({name: 'New Option', values: vals});
		dmApp.setTotalCalc(_.last($scope.options));
	};

	$scope.addCriteria = function() {
		$scope.criteria.push({name: 'New Criteria', weight: 10});
		angular.forEach($scope.options, function(value){
			value.values.push(0);
		});
		//position of criteria, total are set in view (should be in a directive?)
	};
});

/************ Services *************/
dmApp.factory('dmDBservice', function($http) {
	return {
		fetchFromDB: function() {
			var query_url = dmApp.db_url + '&q={"dm_id":"'+dmApp.id+'"}&fo=true';
		    return $http.get(query_url);
		},
		saveToDB: function(scope) {
			var data = {"dm_id": dmApp.id, "criteria": scope.criteria, "options": scope.options};
			var query_url = dmApp.db_url + '&q={"dm_id":"'+dmApp.id+'"}&u=true';
			//will update or update if no record found
			return $http.put(query_url, data);
		}
	};
});

/************ Directives *************/
dmApp.directive('editableText', function($document) {
	return function(scope, elem, attr) {

		//Get the next or prev editable text option		
		function getNextEditableTextOption(active, get_prev) {
			
			if (!active.length || 
					!active.parents("#option_rows").length) return;

			var txtsInOption = active.parents(".option_row").find("[editable-text]");
			for (var i=0; i<txtsInOption.length; i++) {
				if ($.contains(txtsInOption.eq(i).parent()[0], active[0])) {
					if (get_prev) {
						if (i > 0) return txtsInOption.eq(i - 1);
					} else {
						if (txtsInOption.length > i + 1) return txtsInOption.eq(i + 1);
					}
				}
			}
		}

		function onBodyClick(args) {
			if ($(".editableForm.active").length && !$(args.target).hasClass("editableForm")) {
				setForm();
				return false;
			}
		}

		function onKeyUp(event) {
			// console.log("key: " + event.which);
			var active = $(".editableForm.active");
			if (active.length) {
				switch(event.which){
					case 9:
						//move selection to next elem
						setForm();
						active = getNextEditableTextOption(active, event.shiftKey);
						if (dmApp.containsData(active))
							active.click();
						return false
					case 13: case 27:
						setForm();
						return false;
				}
			}
		}

		function setForm() {
			if (!$(".editableForm.active").length) return;
			var f = $(".editableForm.active").first();
			var txt = f.parent().find(".editable");
			f.removeClass("active");
			f.hide();
			txt.show();
			$(document.body).unbind('click', onBodyClick);
			$(document.body).unbind('keydown', onKeyUp);
		}

		elem.on('click', function(event) {
			setForm();
			var input = elem.parent().find(".editableForm");
			elem.hide();
			input.show();
			input.addClass("active");
			input.focus();

			//set the event handlers for setting the form
			$(document.body).unbind('click').bind("click", onBodyClick);
			$(document.body).unbind('keydown').bind("keydown", onKeyUp);
			return false;
		});
	}
});

/******** DND Columns/Rows **********/
dmApp.directive('dndRow', function($document) {
	return function(scope, elem, attr) {
		
		function dragStart(e, that) {
			// console.log("at drag start");
			var $this = $(that);

			//set placeholder
			var row = $this.parents(".option_row");
			//add empty row in place of row being dragged
			var emptyRow = $("<div/>").addClass("m-row option_row empty_row clearfix");
			row.after(emptyRow);
			//move the original row offscreen, make it drag image
			e.originalEvent.dataTransfer.setDragImage(row[0], 0, 0);

			//TODO works in FF but not chrome :( - http://www.kryogenix.org/code/browser/custom-drag-image.html
			//chrome really doesn't like it when you modify the row element - the drag image disappears
			//commiting a sin here
			if ($.browser.mozilla) {
				row.css({"position": "absolute", "left": "-1000px"});
			}

			//hacky way to record which element was being dragged
			//alt use e.originalEvent.dataTransfer.setData(text, elem_id);
			row.addClass("active-dnd");
		}

		function dragOver(e) {
			//figure out the position of the mouse relative to the row - move empty row accordingly
			var y = $(document).scrollTop() + e.originalEvent.clientY; //clientY is relative to viewport
			var lh = parseInt( $(this).css("line-height").replace('px', '') );
			var top = $(this).offset().top;
			// console.log("y: " + y + " top: " + top + " lh: " + lh);
			var halfway = Math.floor(lh / 2) + top;
			var myfn =  (y < halfway) ? "before" : "after";
			$(this)[myfn]($(".empty_row"));
			return false;
		}

		//called regardless if drag was successful
		function dragEnd(e) {
			// console.log("drag end");
			//replace empty row w/real row
			if ($(".option_row.active-dnd").length) {
				var row = $(".option_row.active-dnd");
				row.css("position", "static");
				$(".empty_row").detach();
				row.removeClass("active-dnd");
				$document.unbind('dragend', dragEnd);
				$document.unbind('dragover', dragOver);
				$document.unbind('drop', dropSuccess);
			}
			return false;
		}


		//successful drop - target here is the drop zone, not the row elem
		function dropSuccess(e) {
			// console.log("drop success");

			var allRows = $("#matrix #option_rows .m-row:not(.weights)");
			var allActiveRows = allRows.not(".active-dnd");
			var allValueRows = allRows.not(".empty_row");
			var rowIndex = allValueRows.index(allValueRows.filter(".active-dnd"))
			var emptyRowIndex = allActiveRows.index(allActiveRows.filter(".empty_row"));
			// console.log("index of gripped elem: " + rowIndex);
			// console.log("index of empty row: " + emptyRowIndex);
			var removed = scope.options.splice(rowIndex, 1);
			scope.options.splice(emptyRowIndex, 0, removed[0]);
			//event handlers are outside the scope of angular, so we have to manully tell it to update
			scope.$apply();
			return false;
		}

		elem.on('dragstart', function(event) {
			dragStart(event, this);
			//add the other event handlers
			$document.on('dragend', '#matrix #option_rows .m-row:not(.weights)', dragEnd);
			$document.on('dragover', '#matrix #option_rows .m-row:not(.weights)', dragOver);
			$document.on('drop', '#matrix #option_rows .m-row:not(.weights)', dropSuccess);
		});
	};
});

//TODO this could probably be combined with the above directive
dmApp.directive('dndCol', function($document) {
	return function(scope, elem, attr) {

		function updateColLefts() {
			var left = -200;
			$("#matrix .crit-row .crit-rotate:not(.active-dnd)").each(function () {
				$(this).css("left", left + "px");
				left += 30;
			});
		}
		
		function dragStart(e, that) {
			// console.log("at drag start");
			var $this = $(that);

			//set placeholder
			var row = $this.parents(".crit-rotate");
			//add empty row in place of row being dragged
			var emptyRow = $("<div/>").addClass("crit-rotate empty_row").append( $("<div/>").addClass("crit") );
			row.after(emptyRow);

			//move the original row offscreen, make it drag image
			//TODO wont work in Chrome - http://www.kryogenix.org/code/browser/custom-drag-image.html
			//rotate also causes problems in chrome
			
			//FF
			row.css({"left": "-1000px", "transform": "none"});
			//browsers currently cant handle using rotated elems for drag image
			
			//Chrome
			//row.css("z-index", "1000"); //this works in chrome
			//row.css("left", "0");

			e.originalEvent.dataTransfer.setDragImage(row.find(".crit")[0], 0, 0);

			//hacky way to record which element was being dragged
			//alt use e.originalEvent.dataTransfer.setData(text, elem_id);
			row.addClass("active-dnd");
			updateColLefts();
		}

		function dragOver(e) {
			//figure out the position of the mouse relative to the row - move empty row accordingly
			var mouseX = $(document).scrollLeft() + e.originalEvent.clientX; //clientY is relative to viewport
			var elemX = $(this).find(".crit").offset().left; //this is col under mouse
			var lh = parseInt( $(this).css("line-height").replace('px', '') );
			// console.log("mouseX: " + mouseX + " elemX: " + elemX + " lh: " + lh);
			var halfway = Math.floor(lh / 2) + elemX;
			var myfn =  (mouseX < halfway) ? "before" : "after";
			$(this)[myfn]($(".empty_row"));
			updateColLefts();
			return false;
		}

		//called regardless if drag was successful
		function dragEnd(e) {
			// console.log("drag end");
			//replace empty row w/real row
			if ($(".crit-rotate.active-dnd").length) {
				$(".empty_row").detach();
				var row = $(".crit-rotate.active-dnd");
				row.css("transform", "rotate(-66deg)");
				row.removeClass("active-dnd");
				updateColLefts();
				$document.unbind('dragend', dragEnd);
				$document.unbind('dragover', dragOver);
				$document.unbind('drop', dropSuccess);
			}
			return false;
		}

		//successful drop - target here is the drop zone, not the row elem
		function dropSuccess(e) {
			// console.log("drop success");

			var allRows = $("#matrix .crit-row .crit-rotate:not(.c0):not(.cTotal)");
			var allActiveRows = allRows.not(".active-dnd");
			var allValueRows = allRows.not(".empty_row");
			var rowIndex = allValueRows.index(allValueRows.filter(".active-dnd"))
			var emptyRowIndex = allActiveRows.index(allRows.filter(".empty_row"));
			// console.log("index of gripped elem: " + rowIndex);
			// console.log("index of empty row: " + emptyRowIndex);
			var removed = scope.criteria.splice(rowIndex, 1);
			scope.criteria.splice(emptyRowIndex, 0, removed[0]);
	
			$.each(scope.options, function(index, val) {
				var currOptValues = val.values;
				currOptValues.splice( emptyRowIndex, 0, currOptValues.splice(rowIndex, 1)[0] );
			});

			//event handlers are outside the scope of angular, so we have to manully tell it to update
			scope.$apply();
			return false;
		}

		elem.on('dragstart', function(event) {
			dragStart(event, this);
			//add the other event handlers
			$document.on('dragend', dragEnd);
			$document.on('dragover', '#matrix .crit-row .crit-rotate:not(.c0):not(.cTotal)', dragOver);
			$document.on('drop', '#matrix .crit-row .crit-rotate:not(.c0):not(.cTotal)', dropSuccess);
		});
	};
});