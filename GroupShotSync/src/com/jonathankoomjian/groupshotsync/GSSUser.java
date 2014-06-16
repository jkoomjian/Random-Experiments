package com.jonathankoomjian.groupshotsync;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.StrictMode;
import android.util.Log;

import com.kii.cloud.storage.KiiUser;
import com.kii.cloud.storage.callback.KiiUserCallBack;

/**
 * Handles all the user interaction with Kii
 */
public class GSSUser {
	
	public static String PREFS = "group_shot_sync_prefs";
	
	public static void createUser(String name, String email, KiiUserCallBack callback) {
		KiiUser.Builder builder = KiiUser.builderWithEmail(email);
		KiiUser user = builder.build();
//		user.setDisplayname(name); //validation is causing problems - wont allow empty name
		user.set("name", name);
		user.register(callback, GroupPhotoSync.USER_PASS); 
	}
	
	public static boolean loginFromToken(Context appCtx) {
		SharedPreferences prefs = appCtx.getSharedPreferences(GSSUser.PREFS, Context.MODE_PRIVATE); 
		String token = prefs.getString("auth_token", null);
		if (token != null) {
			Log.d("me", "auth token found");
			//TODO this should us an async task with progress updater
			//http://stackoverflow.com/questions/6343166/android-os-networkonmainthreadexception
			StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
			StrictMode.setThreadPolicy(policy);
			
			try {
				KiiUser.loginWithToken(token);
				return true;
			} catch (Exception e) {
				Log.d("me", "Unable to login from token", e);
			}
		} else {
			Log.d("me", "auth token not found");
		}
		return false;
	}
	
	public static void storeToken(KiiUser user, Context appCtx) {
		String accessToken = user.getAccessToken();
		SharedPreferences prefs = appCtx.getSharedPreferences(GSSUser.PREFS, Context.MODE_PRIVATE);
		SharedPreferences.Editor editor = prefs.edit();
		editor.putString("auth_token", accessToken);
		editor.commit();
		Log.d("me", "auth token saved");
	}
}
