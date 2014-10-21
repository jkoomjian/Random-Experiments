package com.jonathankoomjian.groupshotsync;

import java.util.LinkedList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

/* This BroadcastReceiver is responsible for updating the list of nearby friends */
public class UpdateNearbyFriendsReceiver extends BroadcastReceiver {
	public static String FRIENDS_UPDATE = "com.jonathankoomjian.groupshotsync.friendsupdate";
	public static String USERS = "users";
	
	@Override
	public void onReceive(Context ctx, Intent intent) {
		GroupPhotoSync app = (GroupPhotoSync)ctx.getApplicationContext();
		app.connections.clear();

		try {
			String userDetailsJson = intent.getStringExtra(UpdateNearbyFriendsReceiver.USERS);
			JSONArray userDetails = new JSONArray(userDetailsJson);
			
			for (int i=0; i<userDetails.length(); i++) {
				JSONObject curr = userDetails.getJSONObject(i);
				
				//check for new photos
				this.downloadFiles(this.getFilesToDownload(curr), ctx);

				String name = curr.getString("name");
				String email = curr.getString("email");
				String displayName = (name.length() > 0) ? name+" ("+email+")" : email;
				app.connections.add(displayName);
			}
			
			//Update UI
			app.notifyConnectionsChanged();
		} catch (JSONException e) {
			Log.e("me", "Unable to read json", e);
		}
	}
	
	public String[] getFilesToDownload(JSONObject curr) throws JSONException {
		List<String> uris = new LinkedList<String>();
		
		//check for new photos
		JSONArray uploaded = curr.getJSONArray("uploaded");
		for (int j=0; j<uploaded.length(); j++) {
			JSONObject currUpload = uploaded.getJSONObject(j);
			if (
				GroupPhotoSync.startTime < currUpload.getLong("timestamp") && 
				!GroupPhotoSync.photosDownloaded.contains(currUpload.getString("uri"))) {
				String fileUri = currUpload.getString("uri");
				GroupPhotoSync.photosDownloaded.add(fileUri);
				uris.add(fileUri);
			}
		}
		return uris.toArray(new String[uris.size()]);
	}

	public void downloadFiles(String[] fileUris, Context ctx) {
		for (String uri : fileUris) {
			new FileTransport().download(uri, ctx);
		}
	}
}