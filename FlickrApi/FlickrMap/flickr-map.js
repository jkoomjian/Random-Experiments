var flickrMap = {

	loadPoints: function() {
		$("img").each(function() {
			var $img = $(this);
			if ($img.attr("id") && window[ $img.attr("id") ]) {
				var id = $img.attr("id");

				//set up the image so we can use it
				$img.wrap("<div class='flickr-map' />");

				var dataset = window[ id ];
				for (var i=0; i<dataset.length; i++) {
					var curr = dataset[i];

					$("<a />")
							.css({'left': curr[0], 'top': curr[1], 'background-color': curr[2], 'border-color': curr[2]})
							.attr({'data-local-url': curr[3], 'href': curr[4], 'target': '_blank'})
							.hover(flickrMap.onHover, flickrMap.onUnHover)
							.appendTo($img.parent());
				}
			}
		});
	},

	onHover: function() {
		var $a = $(this);
		$a.addClass("hover");

		var pointPos = $a.position();
		var pointAbsPos = $a.offset();

		//detailW,H = amount the detail extends past the point
		var detailW = 40 - 2 + 81;
		var detailH = (81 / 2) - (5 / 2); //(img h + padding / 2) + (point h/2)

		//(img h + padding / 2) + (point w/2)
		var detailImgOffsetW = 31 + 5 - 2;
		var detailImgOffsetH = detailH * -1;
		var detailArrowOffsetW = 5 - 2;
		var detailArrowOffsetH = -35.5 + 2.5;
		var arrowType = 'left';

		if (pointAbsPos.left + detailW > $( window ).width() + $(window).scrollLeft()) {
			detailImgOffsetW = 2 - 29 - 81;
			detailArrowOffsetW = 2 - 50;
			arrowType = 'right'
		}

		//detail extends below viewport
		if (pointAbsPos.top + detailH > $(window).height() + $(window).scrollTop()) {
			detailArrowOffsetW = (-71/2) + (5/2);
			detailArrowOffsetH = 2 - 50;
			detailImgOffsetW = (-81/2) + (5/2);
			detailImgOffsetH = 2 - 31 - 81;
			arrowType = 'down'
		}

		//detail extends above viewport
		if (pointAbsPos.top - detailH < $(window).scrollTop()) {
			detailArrowOffsetW = (-71/2) + (5/2);
			detailArrowOffsetH = 5 - 2;
			detailImgOffsetW = (-81/2) + (5/2);
			detailImgOffsetH = 5 - 2 + 31;
			arrowType = 'up'
		}

		//add the detail elems
		$("<div />")
			.addClass("flickr-map-img-details")
			.css({
				'left': pointPos.left + detailImgOffsetW,
				'top': pointPos.top + detailImgOffsetH,
				'border-color': $a.css("background-color"),
				'background-image': "url('" + $a.attr("data-local-url") + "')"
			})
			.appendTo($a.parent());
		$("<div />")
			.addClass("flickr-map-img-details-arrow " + arrowType)
			.css({
				'left': pointPos.left + detailArrowOffsetW,
				'top': pointPos.top + detailArrowOffsetH,
				'border-color': $a.css("background-color"),
			})
			.appendTo($a.parent());
	},

	onUnHover: function() {
		var $a = $(this);
		$a.removeClass("hover");
		$(".flickr-map-img-details, .flickr-map-img-details-arrow").remove();
	}
};


$(document).ready(function() {
	flickrMap.loadPoints();
});