package com.jonathankoomjian.groupshotsync;

import java.util.List;

import android.app.Activity;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.os.Bundle;
import android.os.Handler;
import android.provider.MediaStore;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;
import android.widget.ToggleButton;

public class HomeActivity extends Activity {

	static final int TAKE_PHOTO_REQUEST = 0;
	private UpdateNearbyFriendsReceiver receiver = new UpdateNearbyFriendsReceiver();
	private IntentFilter filter = new IntentFilter(UpdateNearbyFriendsReceiver.FRIENDS_UPDATE);
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_home);
		GroupPhotoSync.appCtx = getApplicationContext();
		GroupPhotoSync.initServerTime();
		
		//setup list view
		ListView friendsListView = (ListView)findViewById(R.id.friendsListView);
		GroupPhotoSync app = (GroupPhotoSync)getApplicationContext();
		app.aa = new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, app.connections);
		friendsListView.setAdapter(app.aa);
		
		 app.uiHandler = new Handler();
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.home, menu);
		return true;
	}

	@Override
	protected void onResume() {
		super.onResume();
		Log.d("me", "at onResume");
		GSSControl control = GSSControl.get(this);
		control.start();
		
		//listen for UI updates
		registerReceiver(receiver, filter);
	}
	
	@Override
	protected void onPause() {
		super.onPause();
		unregisterReceiver(receiver);
	}

	@Override
    protected void onStop() {
        super.onStop();
        //TODO getting called when camera opens
        Log.d("me", "at onStop");
//        GSSControl.get(this).stop();
    }

	/*------------ UI Elements ----------------------*/
	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		Intent intent = null;
		switch (item.getItemId()) {
	        case R.id.gss_help:
	        	Log.d("", "at help");
	            intent = new Intent(this, HelpActivity.class);
	            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
	            startActivity(intent);
	            return true;
	        case R.id.gss_settings:
	        	Log.d("", "at settings");
	            intent = new Intent(this, SettingsActivity.class);
	            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
	            startActivity(intent);
	        	return true;
	        default:
	            return super.onOptionsItemSelected(item);
	    }
	}
	
	public void onToggleClicked(View view) {
	    // Is the toggle on?
	    boolean on = ((ToggleButton) view).isChecked();
	    if (on) {
	    	Log.d("me", "on/off button toggled on");
	    	GSSControl.get(this).start();
	    } else {
	    	Log.d("me", "on/off button toggled off");
	    	GSSControl.get(this).stop();
	    }
	}
	
	
	/*------------ Camera Utils --------------------*/
	public void takePicture(View view) {
		if (!this.hasCamera()) {
			Toast.makeText(getApplicationContext(), "No camera detected", Toast.LENGTH_SHORT).show();
			return;
		}
	    Intent takePictureIntent = new Intent(MediaStore.INTENT_ACTION_STILL_IMAGE_CAMERA);
	    startActivity(takePictureIntent);
	    Toast.makeText(getApplicationContext(), "Press back to return to app", Toast.LENGTH_SHORT).show();
	}
	
	public boolean hasCamera() {
		PackageManager packageManager = getApplicationContext().getPackageManager();
		if (!packageManager.hasSystemFeature(PackageManager.FEATURE_CAMERA)) return false;
	    List<ResolveInfo> list = packageManager.queryIntentActivities(new Intent(MediaStore.ACTION_IMAGE_CAPTURE),
	    															  PackageManager.MATCH_DEFAULT_ONLY);
	    return list.size() > 0;
	}
}