package com.jonathankoomjian.groupshotsync.test;

import java.util.List;

import android.test.AndroidTestCase;
import android.util.Log;

import com.jonathankoomjian.groupshotsync.GroupPhotoSync;
import com.jonathankoomjian.groupshotsync.KiiSync;
import com.kii.cloud.storage.KiiObject;
import com.kii.cloud.storage.KiiUser;

public class KiiSyncTest extends AndroidTestCase {

	KiiUser user;
	public static String userEmail = "jkoomjian+kiitest@gmail.com";
	public static String userName = "jkoomjian+kiitest";
	public static String userPass = "my_pass";
	KiiSync sync = KiiSync.get();
	
	public KiiSyncTest() {
		super();
	}

	public void setUp() throws Exception {
		new GroupPhotoSync().onCreate();
		this._signIn();
//		_createKiiUser(); //setup
		sync.clearAll();
		Log.d("test", "clearing data");
	}
	
	public void _signIn(String... userEmailArg) throws Exception {
		String userEmail = userEmailArg.length > 0 ? userEmailArg[0] : KiiSyncTest.userEmail;
		this.user = KiiUser.logIn(userEmail, KiiSyncTest.userPass);
	}
	
	public void _printKiiData() throws Exception {
		List<KiiObject> objLists = sync.queryKii();
		Log.d("test", "Returned " + objLists.size() + " objects");
		for (KiiObject o : objLists) {
			Log.d("test", o.toString());
		}
	}
	
	public void testUpdateLocation() throws Exception {
		this._printKiiData();
		sync.updateLocation(KiiSyncTest.userEmail, "", 2, 4);
		sync.updateLocation(KiiSyncTest.userEmail, "", 2, 3);
		this._printKiiData();
		List<KiiObject> objLists = sync.queryKii(); 
		assertEquals(1, objLists.size());
		assertEquals(2.0, objLists.get(0).getGeoPoint("location").getLatitude());
		assertEquals(3.0, objLists.get(0).getGeoPoint("location").getLongitude());
	}
	
	public void testGetNearbyUsers() throws Exception {
		this._printKiiData();
		double lat = 47.6279215;
		double lon = -122.3451836;
		String testSubjectEmail = "jkoomjian+kii-other@gmail.com";
//		KiiUser testUser = KiiUser.findUserByEmail(testSubjectEmail);
		
		//looking for other users besides the current user (jkoomjian+kiitest@gmail.com)
		sync.updateLocation(testSubjectEmail, "", lat, lon);
		assertEquals(1, sync.getNearbyUsers(this.user, lat, lon).size());
		
		//exclude current user's record
		sync.clearAll();
		sync.updateLocation(KiiSyncTest.userEmail, "", lat, lon);
		assertEquals(0, sync.getNearbyUsers(this.user, lat, lon).size());
		sync.clearAll();
		sync.updateLocation(testSubjectEmail, "", lat, lon);

		//not active
		KiiObject testSubjectRecord = sync.getObjectByEmail(testSubjectEmail);
		testSubjectRecord.set("active", false);
		testSubjectRecord.save();
		assertEquals(0, sync.getNearbyUsers(this.user, lat, lon).size());
		testSubjectRecord.set("active", true);
		testSubjectRecord.save();
		assertEquals(1, sync.getNearbyUsers(this.user, lat, lon).size());
		
		//location out of bounds
		sync.updateLocation(testSubjectEmail, "", 47.626, -122.347);
		assertEquals(0, sync.getNearbyUsers(this.user, lat, lon).size());
		sync.updateLocation(testSubjectEmail, "", 47.629, -122.347);
		assertEquals(0, sync.getNearbyUsers(this.user, lat, lon).size());
		
		//location in bounds
		sync.updateLocation(testSubjectEmail, "", 47.6283, -122.344);
		assertEquals(1, sync.getNearbyUsers(this.user, lat, lon).size());

		//modified too long ago - set session exp to the future
		long sessDuration = GroupPhotoSync.SESSION_DURATION;
		GroupPhotoSync.SESSION_DURATION = -1 * 10 * 60 * 1000;
		this._printKiiData();
		assertEquals(0, sync.getNearbyUsers(this.user, lat, lon).size());
		//reset session duration
		GroupPhotoSync.SESSION_DURATION = sessDuration;
		assertEquals(1, sync.getNearbyUsers(this.user, lat, lon).size());
	}
	
	public void testGetServerTime() {
		Log.d("me", "Curr Server Time1: " + sync.getServerTime());
		Log.d("me", "Curr Server Time2: " + sync.getServerTime());
		Log.d("me", "Curr Server Time3: " + sync.getServerTime());
	}
}