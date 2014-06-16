package com.jonathankoomjian.groupshotsync;

import java.util.Date;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Handler;
import android.util.Log;
import android.widget.ToggleButton;

import com.kii.cloud.storage.KiiUser;

public class GSSControl {

	public LocationFinder locFind;
	public PhotoObserver po;
	public Context appCtx;
	public static GSSControl control;
	public boolean isRunning = false;
	
	Runnable onTimeout;
	private Handler timeoutHandler;
	private AlarmManager alarmManager;
	private PendingIntent alarmIntent;
	
	public static GSSControl get(Context appCtx) {
		if (control == null) {
			control = new GSSControl();
			control.appCtx = appCtx;
	
			final Context myCtx = appCtx;
			control.onTimeout = new Runnable() {
		        @Override
		        public void run() {
		        	Log.d("me", "Session Timed Out!");
		        	GSSControl.get(myCtx).stop();
		        }
			};
		}
		return control;
	}
	
	public void start() {
		if (isRunning) return; else isRunning = true;
		
		//start location service - find my location
		if (this.locFind == null) {
			this.locFind = new LocationFinder(this.appCtx);
		}
		this.locFind.find();
		
		//start photo watch
		if (po == null) {
			po = new PhotoObserver();
		}
		po.startWatching();

		//start background thread to set cur location, get nearby users
		Log.d("me", "starting update service");
		if (this.alarmManager == null) this.alarmManager = (AlarmManager)this.appCtx.getSystemService(Activity.ALARM_SERVICE);
		if (this.alarmIntent == null) this.alarmIntent = PendingIntent.getService(this.appCtx, 0, new Intent(appCtx, GroupUpdateService.class), 0);
		alarmManager.setRepeating(AlarmManager.RTC_WAKEUP, new Date().getTime(), (GroupPhotoSync.SECONDS_BETWEEN_UPDATES * 1000), this.alarmIntent);
		
		//session timout thread
		if (this.timeoutHandler == null) this.timeoutHandler = new Handler();
		this.timeoutHandler.postDelayed(this.onTimeout, GroupPhotoSync.SESSION_DURATION);
		
		//set start button on
		Log.d("me", "checking start button");
		try{
			if (this.appCtx instanceof Activity) {
				ToggleButton toggle = (ToggleButton) (((Activity)this.appCtx).findViewById(R.id.toggleButton1));
				toggle.setChecked(true);
			}
		} catch (Exception e) {
			Log.e("me", "error casting", e);
		}

		//TODO display status bar notification
	}
	
	public void stop() {
		Log.d("me", "at stop()");
		if (!isRunning) return; else isRunning = false;
		
		//stop location service
		if (this.locFind != null) this.locFind.stopLocationRequests();
		
		//stop PhotoObserver
		if (this.po != null) this.po.stopWatching();
		
		//stop updates
		if (this.alarmManager != null && this.alarmIntent != null) this.alarmManager.cancel(this.alarmIntent);

		//stop session timeout
		if (this.timeoutHandler != null) this.timeoutHandler.removeCallbacks(this.onTimeout);
		
		//turn off start button
		try {
			if (this.appCtx instanceof Activity) {
				((ToggleButton) (((Activity)this.appCtx).findViewById(R.id.toggleButton1))).setChecked(false);
			}
		} catch (Exception e) {
			Log.e("me", "error casting", e);
		}

		//stop syncing photos
		final GroupPhotoSync finalApp = (GroupPhotoSync)this.appCtx.getApplicationContext();
		finalApp.connections.clear();
		finalApp.notifyConnectionsChanged();
		new AsyncTask<Void, Void, Void>() {
			protected Void doInBackground(Void... params) {
				try {
					KiiSync.get().deactivateSession(KiiUser.getCurrentUser().getEmail());
				} catch (Exception e) {
					Log.e("me", "unable to deactivate session", e);
				}
				return null;
			}
		}.execute(new Void[0]);
		
		//TODO hide status bar notification
	}
	
}