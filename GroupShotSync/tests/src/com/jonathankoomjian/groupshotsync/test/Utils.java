package com.jonathankoomjian.groupshotsync.test;

import java.util.List;

import android.test.AndroidTestCase;

import com.jonathankoomjian.groupshotsync.GroupPhotoSync;
import com.jonathankoomjian.groupshotsync.KiiSync;
import com.kii.cloud.storage.KiiObject;
import com.kii.cloud.storage.KiiUser;

public class Utils extends AndroidTestCase {
	
	
	public static KiiUser createKiiUser(String... userEmailArg) throws Exception {
		String userEmail = userEmailArg.length > 0 ? userEmailArg[0] : KiiSyncTest.userEmail;
		KiiUser user = KiiUser.builderWithEmail(userEmail).build();
		user.register(KiiSyncTest.userPass);
		return user;
	}

	public static void clearAll() throws Exception {
		KiiSync sync = KiiSync.get();
		new GroupPhotoSync().onCreate();
		KiiUser.logIn(KiiSyncTest.userEmail, KiiSyncTest.userPass);
		List<KiiObject> objs = sync.queryKii();
		for (KiiObject o : objs) {
			o.delete();
		}
	}
	
	public Utils() {
		super();
	}
	
	/* Setup to use a test because you cant run normal java apps in 
	 * an android project :(
	 * All I can figure out is how to run Activities and tests.
	 */
	public void testMain() throws Exception {
//		Utils.createKiiUser();
		Utils.clearAll();
	}
}