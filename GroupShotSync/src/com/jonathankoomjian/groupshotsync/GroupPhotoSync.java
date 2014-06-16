package com.jonathankoomjian.groupshotsync;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Pattern;

import org.json.JSONArray;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.app.AlarmManager;
import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Environment;
import android.os.Handler;
import android.util.Log;
import android.util.Patterns;
import android.widget.ArrayAdapter;

import com.kii.cloud.storage.Kii;
import com.kii.cloud.storage.exception.CloudExecutionException;

public class GroupPhotoSync extends Application {
	/* Global variables go here */
	
	public static Context appCtx;
	
	//The max distance someone can be and still be considered nearby (in meters)
//	public static double NEARBY_DISTANCE = 100;
	//TODO optimus gps is very unreliable
	public static double NEARBY_DISTANCE = 1000;
	
	//user must be active w/in last 30 min
//	public static long SESSION_DURATION = 15 * 1000;
	public static long SESSION_DURATION = AlarmManager.INTERVAL_FIFTEEN_MINUTES;
	
	//length of time to wait between updates
	public static int SECONDS_BETWEEN_UPDATES = 15;
	
	//use 1 password for all users
	public static final String USER_PASS = "123ABC";

	//File bucket
	public static final String KII_FILE_BUCKET = "GSS_FILE_BUCKET";
	
	public static final String DOWNLOAD_FILE_PREFIX = "IMG_GSS_";
	
	
	public static String CAMERA_DIR = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM).getAbsolutePath() + "/Camera";
	
	//Photo coordination
	//will be set to server time - start w/local time by default
	public static long kiiTimeOffset = 0;
	public static long startTime = System.currentTimeMillis();

	//list of uris of photos downloaded
	public static List<String> photosDownloaded = new LinkedList<String>();
	//[{uri:, timestamp: }]
	public static JSONArray photosUploaded = new JSONArray();
	

	
	/*------------ Non-static application vars -----------------*/
	public ArrayList<String> connections = new ArrayList<String>();
	public ArrayAdapter<String> aa;
	//handler to jump back into the UI thread
	public Handler uiHandler;

	
	public void notifyConnectionsChanged() {
		if (connections.size() == 0) {
			connections.add("    No nearby friends :-(");
		}
		
		this.aa.notifyDataSetChanged();
	}
	
	@Override
    public void onCreate() {
        super.onCreate();
        // initialize the Kii SDK!
        //TODO enter kii credentials here
        Kii.initialize("", "", Kii.Site.US);
    }
	
	/*------------ Utilities -----------------*/
	
	/* There is a bug in the kii errors where it returns the whole json body rather than the exception */
	public static String getMessage(Exception e) {
		if (e instanceof CloudExecutionException) {
			Log.d("me", "is cloud ex");
			String body = ((CloudExecutionException) e).getBody();
			Log.d("me", body);
			if (body.contains("message")) {
				return body.replaceAll("^[\\d\\D]*?\"message\" : \"(.*?)\"[\\d\\D]*?$", "$1");
			}
		}
		return e.getLocalizedMessage();
	}
	
	public static String getFromPreferences(String key, Context ctx) {
		SharedPreferences prefs = ctx.getSharedPreferences(GSSUser.PREFS, Context.MODE_PRIVATE);
		return prefs.getString(key, null);
	}
	
	public static void setInPreferences(String key, String value, Context ctx) {
		SharedPreferences prefs = ctx.getSharedPreferences(GSSUser.PREFS, Context.MODE_PRIVATE);
		SharedPreferences.Editor editor = prefs.edit();
		editor.putString(key, value);
		editor.commit();
	}

	//set the server time in async thread
	public static void initServerTime() {
		new AsyncTask<Void, Void, Void>() {
			protected Void doInBackground(Void... params) {
				long serverTime = KiiSync.get().getServerTime();
				GroupPhotoSync.kiiTimeOffset = System.currentTimeMillis() - serverTime;
				GroupPhotoSync.startTime = serverTime;
				return null;
			}
		}.execute(new Void[0]);
	}
	
	public static long getServerTime() {
		return System.currentTimeMillis() - GroupPhotoSync.kiiTimeOffset;
	}
	
	public static String getDefaultEmail(Context ctx) {
		//http://stackoverflow.com/questions/2112965/how-to-get-the-android-devices-primary-e-mail-address
		Pattern emailPattern = Patterns.EMAIL_ADDRESS; // API level 8+
		Account[] accounts = AccountManager.get(ctx).getAccounts();
		for (Account account : accounts) {
		    if (emailPattern.matcher(account.name).matches()) {
		    	return account.name;
		    }
		}
		return null;
	}
}