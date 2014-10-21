package com.jonathankoomjian.groupshotsync.test;

import android.test.AndroidTestCase;
import android.util.Log;

import com.jonathankoomjian.groupshotsync.GroupPhotoSync;
import com.kii.cloud.storage.KiiUser;

public class GeneralPurposeTest extends AndroidTestCase {

	public GeneralPurposeTest() {
		super();
	}
	
	public void setUp() throws Exception {
	}

	public void testGetDefaultEmail() {
		Log.d("me", "email: " + GroupPhotoSync.getDefaultEmail(getContext()));
	}
	
	public void testGetUser() throws Exception {
		KiiUser.logIn(KiiSyncTest.userEmail, KiiSyncTest.userPass);
		KiiUser u = KiiUser.findUserByEmail("jkoomjian+nx1@gmail.com");
		System.out.println(u.getDisplayname());
		System.out.println(u.toJSON().toString());
//		System.out.println(u.getString("name"));
		System.out.println(u);
	}
}
