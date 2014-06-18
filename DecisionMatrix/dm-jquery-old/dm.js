

/************* Add Columns/Rows ***************/
function addCriteria() {
	var label = $("#criteria-template .crit-rotate").clone();
	$(".crit-row .total").parent().before(label);
	//set position of new crit label - replace total w/new, move total over 1 col
	label.css("left", $(".crit-row .cTotal").css("left"));
	$(".crit-row .cTotal").css("left", "+=30");

	$("#criteria-template .weight").clone().insertBefore(".m-row.weights .total_weight");
	//for each option row, add an option
	$("#matrix .option_row:not(.weights)").each(function() {
		$("#criteria-template .value:not(.weight)").clone().insertBefore($(this).find(".total_value"));
	});
	updateTotal();
	return false;
}

function addOption() {
	$("#option_rows").append( $("#option-template .option_row").clone() );
	for (var i=0; i<$(".crit-row").children().length - 2; i++){
		$("#option_rows .option_row:last .total_value").before( $("#criteria-template .value:not(.weight)").clone() );
	}
	updateTotal();
	return false;
}

/******************** Set Values *********************/
function getEditableValue(elem) {
	return $(elem).find(".editable").text();
}

function textToForm() {
	setForm(true);
	var val = $(this).text();
	var w = $(this).innerWidth() + 10 +  'px';
	var input = $("<input/>").prop({"type": "text", "value": val, 
									"class": "editableForm", 
									"style": "width: " + w + "; line-height: normal; padding: 0;"});
	$(this).hide();
	$(this).after(input);
	$(input).focus();
	return false;
}

function setForm(clear) {
	if (!$(".editableForm").length) return;
	var f = $(".editableForm").first();
	var txt = f.parent().find(".editable");
	if (!clear) {
		txt.text(f.val());
	}
	f.remove();
	txt.show();
	updateTotal();
}

function updateTotal() {
	var weight, score, total;
	$("#matrix .option_row:not(.weights)").each(function() {
		total = 0;
		$(this).find(".value").each(function(index) {
			weight = getEditableValue($("#matrix .weights .weight:not(.total_weight)").get(index));
			score = getEditableValue(this);
			total += weight * score;
		});
		//set the total
		$(this).find(".total_value").text(total);
	});
}

/******** DND Columns/Rows **********/
// function _getLocation

function dragStart(e) {
	console.log("at drag start");
	//set original location

	//set placeholder
	var row = $(this).parents(".option_row");
	//add empty row in place of row being dragged
	row.after($(".empty_row"));
	//move the original row offscreen, make it drag image
	row.css({"position": "absolute", "left": "-1000px"});
	e.originalEvent.dataTransfer.setDragImage(row[0], 0, 0);

	//hacky way to record which element was being dragged
	//alt use e.originalEvent.dataTransfer.setData(text, elem_id);
	row.addClass("active-dnd");
}

function dragOver(e) {
	//figure out the position of the mouse relative to the row - move empty row accordingly
	var y = $(document).scrollTop() + e.originalEvent.clientY; //clientY is relative to viewport
	var lh = parseInt( $(this).css("line-height").replace('px', '') );
	var top = $(this).offset().top;
	console.log("y: " + y + " top: " + top + " lh: " + lh);
	var halfway = Math.floor(lh / 2) + top;
	var myfn =  (y < halfway) ? "before" : "after";
	$(this)[myfn]($(".empty_row"));
	return false;
}

//called regardless if drag was successful
function dragEnd(e) {
	//replace empty row w/real row
	if ($(".option_row.active-dnd").length) {
		var row = $(this).parents(".option_row");
		row.css("position", "static");
		$("#option-template").after($(".empty_row"));
		row.removeClass("active-dnd");
	}
	return false;
}


//successful drop - target here is the drop zone, not the row elem
function dropSuccess(e) {
	//replace empty row w/real row
	var row = $(".active-dnd");
	row.css("position", "static");
	$(".empty_row").after(row);
	$("#option-template").after($(".empty_row"));
	row.removeClass("active-dnd");
	//this won't stop propigation to dragEnd
	return false;
}

/******** On Load **********/
function onLoad() {
	//figure out a unique key for this matrix
	var rand = '';
	while (rand.length < 5)	{rand += String.fromCharCode(_.random(65, 90));}
	window.history.pushState({}, "", "#" + rand.toLowerCase());
}

$(document).ready(function() {
	$("#add-critera-link").click(addCriteria);
	$("#add-option-link").click(addOption);
	$(document).on("click", ".editable", textToForm);
	$(document).on("click", "body", function(args) {
		if ($(".editableForm").length && !$(args.target).hasClass("editableForm")) {
			setForm();
		}
	});
	$(document).on("keyup", function(event) {
		//console.log("key: " + event.which);
		if ($(".editableForm").length) {
			switch(event.which){
				case 9 || 13:
					setForm();
					break;
				case 27:
					setForm(true);
					break;
			}
		}
	});
	onLoad();
	updateTotal();

	//DND
	$(document).on('dragstart', '#matrix #option_rows .m-row a.grip', dragStart);
	$(document).on('dragend', '#matrix #option_rows .m-row a.grip', dragEnd);
	$(document).on('dragover', '#matrix #option_rows .m-row:not(.weights)', dragOver);
	$(document).on('drop', '#matrix #option_rows .m-row:not(.weights)', dropSuccess);
});