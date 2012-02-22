/**
 * TODO
 * setting position absolute is not perfect
 * cut off anything which appears below the screen
 */

wkbt = {
	jq:jQuery.noConflict(true),
	activeElems:[],
	log: function(msg) {
		if (window["console"] != undefined)
			console.log(msg);
	},
	
	//----------Setup------------
	start:function() {
		wkbt.activateChildren(wkbt.jq(document.body));
//		wkbt.iterate();
		setInterval("wkbt.iterate()", 50);
		//wkbt.jq(window).bind('keypress', wkbt.iterate);
	},
	iterate:function() {
		wkbt.jq.each(wkbt.activeElems, function(index, val) {
			wkbt.move(val);
		});
	},
	
	//----------Movement------------
	activateChildren:function(elem) {
		var offset;
		//console.log(elem["wkbt_added_children"]);
		if (!elem["wkbt_added_children"]) {
			elem.wkbt_added_children = true;
			//console.log("activating children: " + elem.children().length);
			
			//making the elems absolute moves them out of the flow, and changes the position
			//of the following elems. So get the positions of all elems before anything is moved.
			wkbt.jq.each(elem.children(), function(index, curr) {
				curr = wkbt.jq(curr);
				if (curr.is(':visible')) {
					offset = curr.offset();
					wkbt.log("setting " + curr[0].className + " to pos abs: left: " + offset.left + " top: " + offset.top);
					curr[0].wkbtLeft = offset.left;
					curr[0].wkbtTop = offset.top;
				}
			});
			
			wkbt.jq.each(elem.children(), function(index, curr) {
				curr = wkbt.jq(curr);
				if (curr.is(':visible')) {
					//set position absolute
					if (curr.css("display") == "inline") {
						curr.css("display", "block");
					}
					wkbt.log("setting " + curr[0].className + " to pos abs: left: " + curr[0].wkbtLeft + " top: " + curr[0].wkbtTop);
					curr.css("left", curr[0].wkbtLeft);
					curr.css("top", curr[0].wkbtTop);
					curr.css("position", "fixed");
					curr.css("margin", "0");
					
					//set velocities
					curr.wkbt_x_vel = wkbt.getVelocity();
					curr.wkbt_y_vel = wkbt.getVelocity();
					
					wkbt.activeElems.push(curr);
				}
			});
		}
	},
	getVelocity:function() {
		//return a random # between -5 to 5
		return Math.round(Math.random() * 10) - 5
	},
	move:function(elem) {
		wkbt.log("x: " + elem.wkbt_x_vel + " y: " + elem.wkbt_y_vel + " left: " + elem.css("left") + " top: " + elem.css("top"));
		var getPosition = function(el, prop) {
			return parseInt(el.css(prop).replace("px", ""));
		}
		var setNewPosition = function(el, prop, changeAttribute) {
			//debugger;
			var viewportEdge = (prop == "left") ? wkbt.jq(window).width() : wkbt.jq(window).height();
			var elemEdge = (prop == "left") ? el.outerWidth() : el.outerHeight();
			//var elemEdge = 0;
			var changeAmt = el[changeAttribute];
			var newPos = getPosition(el, prop) + changeAmt;
			if (newPos < 0 || (newPos+elemEdge) > viewportEdge) {
//				debugger;
				if (newPos < 0) {
					changeAmt = Math.abs(changeAmt);
				} else {
					changeAmt = Math.abs(changeAmt) * -1;
				}
				el[changeAttribute] = changeAmt;
				newPos = getPosition(el, prop) + changeAmt;
				wkbt.activateChildren(el);
			}
			el.css(prop, newPos+"px");
		}
		
		setNewPosition(elem, "left", "wkbt_x_vel");
		setNewPosition(elem, "top", "wkbt_y_vel");
	}
	
};

wkbt.start();