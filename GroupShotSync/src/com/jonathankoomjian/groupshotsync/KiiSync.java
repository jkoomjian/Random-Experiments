package com.jonathankoomjian.groupshotsync;

import java.util.List;

import org.json.JSONArray;

import android.annotation.SuppressLint;
import android.util.Log;

import com.jonathankoomjian.groupshotsync.test.KiiSyncTest;
import com.kii.cloud.storage.GeoPoint;
import com.kii.cloud.storage.Kii;
import com.kii.cloud.storage.KiiBucket;
import com.kii.cloud.storage.KiiObject;
import com.kii.cloud.storage.KiiUser;
import com.kii.cloud.storage.query.KiiClause;
import com.kii.cloud.storage.query.KiiQuery;
import com.kii.cloud.storage.query.KiiQueryResult;

public class KiiSync {

	static KiiSync myKiiSync;
	
	public KiiBucket appBucket; 
	public KiiBucket appBucketTime; 
	KiiObject currUserRecord; 

	public static KiiSync get() {
		if (myKiiSync == null) {
			myKiiSync = new KiiSync();
		}
		return myKiiSync;
	}
	
	public KiiSync() {
		// Create Application Scope Bucket
		this.appBucket = Kii.bucket("GroupShotSync");
		this.appBucketTime = Kii.bucket("GroupShotSyncTime");
	}

	//also get the _modified time - use kii's global time instead of trying to sync 
	//individual phone times
	public long getServerTime() {
		KiiObject timeObj =  this.appBucketTime.object();
		timeObj.set("name", "time_token");
		try {
			timeObj.save();
			timeObj.refresh();
			return timeObj.getModifedTime();
		} catch (Exception e) {
			Log.d("me", "Unable to get server time", e);
		}
		//backup plan
		return System.currentTimeMillis();
	}
	
	//returns null if nothing found
	public KiiObject getObjectByEmail(String email) throws Exception {
		KiiQuery getByEmailQuery = new KiiQuery(KiiClause.equals("email", email.toLowerCase()));
		getByEmailQuery.setLimit(1);
		List<KiiObject> result = this.queryKii(getByEmailQuery);
		return result.size() > 0 ? result.get(0) : null;
	}

	public KiiObject getCurrUserRecord(String email, boolean... force) throws Exception {
		//First check if this record already exists
		if (this.currUserRecord == null) this.currUserRecord = this.getObjectByEmail(email);  
		if (this.currUserRecord == null) this.currUserRecord = this.appBucket.object();
		return this.currUserRecord;
	}
	
	@SuppressLint("DefaultLocale")
	public void updateLocation(String email, String name, double lat, double lon) {
		//save user/id, is_active, lat, lon, updated_at
		if (name == null) name = "";
		
		try {
			currUserRecord = getCurrUserRecord(email);
			currUserRecord.set("email", email);
			currUserRecord.set("name", name);
			currUserRecord.set("active", true);
			currUserRecord.set("location", new GeoPoint(lat, lon));
			currUserRecord.set("uploaded", GroupPhotoSync.photosUploaded);
			//_modified is set automatically
			currUserRecord.save();
		} catch (Exception e) {
			e.printStackTrace();
			Log.e("kii", "Unable to save");
		}
	}
	
	public void deactivateSession(String email) throws Exception {
		GroupPhotoSync.photosUploaded = new JSONArray();
		currUserRecord = getCurrUserRecord(email);
		currUserRecord.set("active", false);
		currUserRecord.set("uploaded", GroupPhotoSync.photosUploaded);
		currUserRecord.save();
	}
	
	public List<KiiObject> getNearbyUsers(KiiUser currUser, double lat, double lon) throws Exception {
		
		String email = currUser.getEmail().toLowerCase();
		
		//user must be in the correct geo region
		GeoPoint myLocation = new GeoPoint(lat, lon);
		
		//user must be active w/in last 10 min
		long sessionTimeout = GroupPhotoSync.getServerTime() - GroupPhotoSync.SESSION_DURATION;
		
		KiiQuery query = new KiiQuery(
				KiiClause.and(
					KiiClause.notEquals("email", email),
					KiiClause.equals("active", true),
					KiiClause.geoDistance("location", myLocation, GroupPhotoSync.NEARBY_DISTANCE, "distance_from_my_loc"),
					KiiClause.greaterThanOrEqual("_modified", sessionTimeout)
				));
		//sort by distance from my location, ascending
		query.sortByAsc("_calculated.distance_from_my_loc");
		return this.queryKii(query);
	}
	
	/* Print all objects in the db - useful for testing */
	public List<KiiObject> queryKii(KiiQuery... kiiQueries) throws Exception {
		KiiQuery query = kiiQueries.length > 0 ? kiiQueries[0] : new KiiQuery();
		KiiQueryResult<KiiObject> result = this.appBucket.query(query);
		return result.getResult();
	}
	
	/* Testing */
	public void clearAll() throws Exception {
		this.currUserRecord = null;
		for (KiiObject o : this.queryKii()) o.delete();
	}
	
	public static KiiUser createKiiUser(String... userEmailArg) throws Exception {
		String userEmail = userEmailArg.length > 0 ? userEmailArg[0] : KiiSyncTest.userEmail;
		KiiUser user = KiiUser.builderWithEmail(userEmail).build();
		user.register(KiiSyncTest.userPass);
		return user;
	}
}