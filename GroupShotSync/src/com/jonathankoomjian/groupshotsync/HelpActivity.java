package com.jonathankoomjian.groupshotsync;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

public class HelpActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_help);
    }

    /** Called when the user clicks the Send button */
    public void contactDeveloper(View view) {
        // Setup the email
    	Intent emailIntent = new Intent(Intent.ACTION_SEND);
    	emailIntent.setType("message/rfc822");
    	// set recipients
    	emailIntent.putExtra(Intent.EXTRA_EMAIL, new String[] {"jkoomjian@gmail.com"});
    	emailIntent.putExtra(Intent.EXTRA_SUBJECT, "Message from GroupShotSync");
    	
    	try {
    		//open the email chooser
    	    startActivity(Intent.createChooser(emailIntent, "Send mail..."));
    	} catch (android.content.ActivityNotFoundException ex) {
    	    Toast.makeText(HelpActivity.this, "There are no email clients installed.", Toast.LENGTH_SHORT).show();
    	}
    }

}