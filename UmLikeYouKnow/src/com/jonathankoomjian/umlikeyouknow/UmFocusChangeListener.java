package com.jonathankoomjian.umlikeyouknow;

import android.view.View;
import android.widget.EditText;

public class UmFocusChangeListener implements View.OnFocusChangeListener {

	public void onFocusChange(View v, boolean hasFocus) {
		//only care about losing focus
		if (!hasFocus) {
			String txt = ((EditText)v).getText().toString();
			
			//separate by comma
			UmUtil.setFillerWords(txt.split(","));
		}
	}
}
