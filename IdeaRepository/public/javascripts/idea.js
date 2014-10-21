var tag_num = 0;
var curr_focus_element = '';

function addTag(list_name, field_name) {
	//alert('value: ' + $(field_name).value);

	//add input object
	$(list_name).innerHTML += "<input type='hidden' name='tag[][name]' value='" + $(field_name).value + "' />";
	//add link
	$(list_name).innerHTML += ",&nbsp;" + $(field_name).value;
	  //ensure save method is kicked off
	$(field_name).focus();
	$(field_name).blur();
}

//Edit Functions
function hoverField(obj) {
	obj.style.cursor='pointer';
	obj.style.background='#FFFF99';
}

function unHoverField(obj) {
	obj.style.cursor='pointer';
	obj.style.background='#FFFFFF';
}

function clickField(obj) {
	if (!subfieldHasFocus(obj)) {
		var obj_id = obj.id;
		$(obj_id + '_text').style.display='none';
		$(obj_id + '_edit').style.display='inline';
		$(obj_id + '_form_edit_area').focus();
	}
}

function clickTag(obj) {
	$(obj.id + '_edit').style.display='inline';
	$(obj.id + '_form_edit_area').focus();
}

function setCurrentFocus(obj) {
	curr_focus_element = obj.id;
}

function unsetCurrentFocus() {
	curr_focus_element = '';
}

function subfieldHasFocus(obj) {
	//alert('curr focus: ' + curr_focus_element + ' obj: ' + obj.id + ' startsWith: ' + curr_focus_element.startsWith(obj.id));
	return curr_focus_element.startsWith(obj.id);
}

function blurCriteriaResponse(obj) {
	//ok, this is totally nuts, but the way this works is:
	//unset the current_focus_element
	//wait for a period of time
	//check to see if an element in the form has focus- if so do nothing, otherwise update the field
	//if we don't wait, this onblur method will complete before onfocus is called, so we will have no way
	//of knowing if the user clicked another field in the form, or something else
	
	unsetCurrentFocus();
	var callback = function() {
								if (!subfieldHasFocus(obj)) {
									blurField(obj);
								}
							};
	setTimeout(callback, 50);
}

//params included in form
function blurField(obj) {
	var text = $(obj.id + '_text'); 
	var form = $(obj.id + '_form');
	var edit_span = $(obj.id + '_edit'); 
	var status = $(obj.id + '_status');
	
	edit_span.style.display='none';
	text.style.display='inline';
	status.innerHTML='Saving...';
	status.style.display='inline';

	//build action
	//ajax call to save object
	new Ajax.Updater(text.id,
								form.action, {
									method: 'post',
									parameters: form.serialize(true),
									onSuccess: function(transport) {
										status.innerHTML = 'Saved!';
									},
									onFailure: function() {
										status.innerHTML = 'Something went horribly wrong! Failed to save';
									},
									onComplete: function() {
										//if we are updating the score
										if ($(obj.id + '_score') != null) $('idea_attr_score').innerHTML = $(obj.id + '_score').innerHTML;
									}
								});
}