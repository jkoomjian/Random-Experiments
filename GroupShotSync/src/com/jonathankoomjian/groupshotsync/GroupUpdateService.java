package com.jonathankoomjian.groupshotsync;

import java.util.List;

import org.json.JSONArray;

import android.app.IntentService;
import android.content.Intent;
import android.util.Log;

import com.kii.cloud.storage.KiiObject;
import com.kii.cloud.storage.KiiUser;

public class GroupUpdateService extends IntentService {

	public GroupUpdateService() {
		super("GroupUpdateService");
	}
	public GroupUpdateService(String name) {
		super(name);
	}
	
	private JSONArray userDetailsToJsonArray(List<KiiObject> records) {
		JSONArray uds = new JSONArray();
		for (KiiObject record : records) uds.put(record.toJSON());
//		Log.d("me", "broadcast sending with data: " + uds.toString());
		return uds;
	}
	
	private void update() {
		try {
			KiiUser currUser = KiiUser.getCurrentUser();
			String lat = GroupPhotoSync.getFromPreferences("last_location_lat", this);
			String lon = GroupPhotoSync.getFromPreferences("last_location_lon", this);
//			Log.d("me", "Curr available lat long: " + lat + " " + lon);
			
			if (currUser != null && lat != null && lon != null) {
				KiiSync sync = KiiSync.get();
				double latD = Double.parseDouble(lat);
				double lonD = Double.parseDouble(lon);

				//first save your location to kii
				sync.updateLocation(currUser.getEmail(), currUser.getString("name"), latD, lonD);
				
				//now get nearby users
				List<KiiObject> records = sync.getNearbyUsers(currUser, latD, lonD);
				
				//send broadcast to update UI
				Intent intent = new Intent(UpdateNearbyFriendsReceiver.FRIENDS_UPDATE);
				intent.putExtra(UpdateNearbyFriendsReceiver.USERS, this.userDetailsToJsonArray(records).toString());
				getApplicationContext().sendBroadcast(intent);
			}
		} catch (Exception e) {
			Log.e("me", "Unable to update group with my location", e);
		}
	}

	@Override
	protected void onHandleIntent(Intent intent) {
		//don't update if stopped
		if (!GSSControl.get(this).isRunning) return;
		update();
	}
}