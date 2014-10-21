package com.jonathankoomjian.groupshotsync.test;

import org.json.JSONObject;

import com.jonathankoomjian.groupshotsync.GroupPhotoSync;
import com.jonathankoomjian.groupshotsync.UpdateNearbyFriendsReceiver;

import android.test.AndroidTestCase;

public class UpdateNearbyFriendsTest extends AndroidTestCase {

	String testJson = "{uploaded:[{timestamp:1375900842276, uri:\"kiicloud://users/bfc28e71-d7ae-4e1b-a101-01e90ba6af2f/buckets/sync:GSS_FILE_BUCKET/objects/249781341418162176-2291581\"}, {timestamp:1375900971591, uri:\"kiicloud://users/bfc28e71-d7ae-4e1b-a101-01e90ba6af2f/buckets/sync:GSS_FILE_BUCKET/objects/249781341418162176-2291628\"}], location:{_type:\"point\", lon:-122.3451652, lat:47.6278751}, active:true, email:\"jkoomjian+30@gmail.com\"}";
	
	public UpdateNearbyFriendsTest() {
		super();
	}
	
	public void setUp() throws Exception {
	}

	public void testGetFilesToDownload() throws Exception {
		JSONObject test = new JSONObject(testJson);
		UpdateNearbyFriendsReceiver rec = new UpdateNearbyFriendsReceiver();
		GroupPhotoSync.startTime = System.currentTimeMillis();
		String[] uris = rec.getFilesToDownload(test);
		this.assertEquals(0, uris.length);
		GroupPhotoSync.startTime = 0;
		uris = rec.getFilesToDownload(test);
		System.out.println(uris);
		this.assertEquals(2, uris.length);
		this.assertEquals(2, GroupPhotoSync.photosDownloaded.size());
		this.assertEquals(0, rec.getFilesToDownload(test).length);
	}
}
