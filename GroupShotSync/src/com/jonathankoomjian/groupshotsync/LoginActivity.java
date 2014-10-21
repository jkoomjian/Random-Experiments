package com.jonathankoomjian.groupshotsync;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.kii.cloud.storage.KiiUser;
import com.kii.cloud.storage.callback.KiiUserCallBack;

/**
 * Activity which displays a login screen to the user
 */
public class LoginActivity extends Activity {

	private TextView mNameField;
    private TextView mEmailField;
    private ProgressDialog mProgress;

    @Override
	protected void onResume() {
		super.onResume();
		//if the user is not logged in, forward to login activity
		if (KiiUser.getCurrentUser() != null || GSSUser.loginFromToken(getApplicationContext())) {
			startActivity(new Intent(this, HomeActivity.class));
		}
		
		//Prefill email field
		mEmailField.setText( GroupPhotoSync.getDefaultEmail(this) );
    }
    
    public void handleSignUp(View v) {

    	// show a loading progress dialog
    	mProgress = ProgressDialog.show(LoginActivity.this, "", "Signing up...", true);

    	// get the username/password combination from the UI
    	String name = mNameField.getText().toString();
    	String email = mEmailField.getText().toString();
    	Log.i("me", "Registering: " + name + ":" + email);

    	KiiUserCallBack onRegister = new KiiUserCallBack() {
    		// catch the callback's "done" request
    		public void onRegisterCompleted(int token, KiiUser user, Exception e) {
    			// hide our progress UI element
    			mProgress.cancel();

    			// check for an exception (successful request if e==null)
    			if(e == null) {
    				// tell the console and the user it was a success!
    				Log.d("me", "Registered: " + user.toString());
    				Toast.makeText(LoginActivity.this, "User registered!", Toast.LENGTH_SHORT).show();

    				//save the access token
    				GSSUser.storeToken(user, getApplicationContext());
    				
    				// go to the next screen
    				Intent myIntent = new Intent(LoginActivity.this.getApplicationContext(), HomeActivity.class);
    				LoginActivity.this.startActivity(myIntent);
    			} else {
    				// otherwise, something bad happened in the request
    				// tell the console and the user there was a failure
    				Log.d("me", "Error registering: " + e.getLocalizedMessage());
    				Toast.makeText(LoginActivity.this, "Error Registering: " + GroupPhotoSync.getMessage(e), Toast.LENGTH_SHORT).show();
    			}
    		}
    	};

    	// create a KiiUser object
    	try {
    		GSSUser.createUser(name, email, onRegister);
    	} catch(Exception e) {
    		mProgress.cancel();
    		Toast.makeText(LoginActivity.this, "Error Registering: " + GroupPhotoSync.getMessage(e), Toast.LENGTH_SHORT).show();
    	}
    }
    
	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        // link our variables to UI elements
        mNameField = (TextView) findViewById(R.id.name_field);
        mEmailField = (TextView) findViewById(R.id.email_field);
    }
}