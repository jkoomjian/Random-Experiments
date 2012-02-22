xpld = function(elemId) {
	//private stuff
	var jq = jQuery.noConflict(true);
	var elem = jq("#"+elemId);
	var numHorizFrag = 3;
	var numVertFrags = 3;
	var fragWidth = elem.width() / numHorizFrag;
	var fragHeight = elem.height() / numVertFrags;
	var elemCenterX = elem.width() / 2;
	var elemCenterY = elem.height() / 2;
	var wrappers = [];
	var timeout;
	
	var animationInterval = 10;
	var fadeOutDelay = 500;
	var fadeOutDuration = 500;
	
	function generateShrapnel() {
		var x = elem.offset().left, y=elem.offset().top;
		
		//debugger;
		//for now just do 2 fragments - figure this dynamically in the future
		var currHFrag = currVFrag = i = j = 0;
		var currFrag, currFragWrapper;
		
		for (i; i<numVertFrags; i++) {
			for (j; j<numHorizFrag; j++) {
				currFragWrapper = jq("<div>");
				currFragWrapper.width(fragWidth);
				currFragWrapper.height(fragHeight);
				currFragWrapper.attr({	"id": "xpld_" + j + "_" + i,
										"x_pos": j,	
										"y_pos": i});
				currFragWrapper.css({	"overflow": "hidden",
										"border": "1px dotted blue",
										"z-index": "10000",
										"position": "fixed",
										"left": (x + (j*fragWidth)) + "px",
										"top": (y + (i*fragHeight)) + "px"});
				
				
				currFrag = elem.clone(false);
				currFrag.css({	"margin-left": (fragWidth * j * -1),
							 	"margin-top": (fragHeight * i * -1)});
				
				wrappers.push(currFragWrapper);
				currFragWrapper.append(currFrag);
				elem.parent().append(currFragWrapper);
			}
			j=0;
		}
		elem.hide();
		return wrappers;
	}
	
	function setVectors() {
		jq.each(wrappers, function() {
			var currCenterX = (this.width() / 2) + (this.attr("x_pos") * fragWidth);
			var currCenterY = (this.height() / 2) + (this.attr("y_pos") * fragHeight);
			
			//figure out angle
			this.attr({	"x_vector": (currCenterX - elemCenterX),
						"y_vector": (currCenterY - elemCenterY)});

			//console.log(this.attr("x_pos") + "_" + this.attr("y_pos") + " x:" + this.attr("x_vector") + " y: " + this.attr("y_vector"));
		});
	};
	
	function setFadeOut() {
		jq.each(wrappers, function() {
			this.fadeOut(fadeOutDuration, function() {
				clearInterval(timeout);
			});
		});
	}
	
	function animate() {
		jq.each(wrappers, function() {
			var newX = parsePx(this.css("left")) + (parsePx(this.attr("x_vector") / 100));
			var newY = parsePx(this.css("top")) + (parsePx(this.attr("y_vector") / 100));
			//console.log("x: " + newX + " y: " + newY);
			this.css({	"left": newX + "px",
						"top": newY + "px"});
		});
	}

	function startAnimation() {
		timeout = setInterval(animate, animationInterval);
		setTimeout(setFadeOut, fadeOutDelay);
	}

	function parsePx(pxStr) {
		//console.log("pxstr: " + pxStr + " typeof " + typeof(pxStr));
		if (typeof(pxStr) == "number") return pxStr;
		return parseInt( pxStr.replace('px', '') );
	}
	
	//Public Stuff-------------------------------------------------
	return {
		jq:jq,
		kaboom: function() {
			generateShrapnel();
			setVectors();
			startAnimation();
		}
	};
}

function explode(elemId) {
	xpld(elemId).kaboom();
}