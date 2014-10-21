package com.jonathankoomjian.groupshotsync;

import java.io.File;

import org.json.JSONObject;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.kii.cloud.storage.Kii;
import com.kii.cloud.storage.KiiACL;
import com.kii.cloud.storage.KiiACL.FileAction;
import com.kii.cloud.storage.KiiACLEntry;
import com.kii.cloud.storage.KiiAnonymousUser;
import com.kii.cloud.storage.KiiFile;

/**
 * Send and receive files using push notifications.
 * Should not be run on the main thread.
 */
public class FileTransport {

	public void send(String path) {
		
		//First create a kii object and save it to the kii cloud
		Log.d("me", "uploading file: " + path);
		Uri fileUri;
			
		try {
			File file = new File(GroupPhotoSync.CAMERA_DIR, path);
			Log.d("me", "at new file, exists2: " + file.exists() + " can read: " + file.canRead());
			KiiFile kiiFile = Kii.fileBucket(GroupPhotoSync.KII_FILE_BUCKET).file(file);
			kiiFile.save();

			//make file world readable
			KiiACL acl = kiiFile.acl();
			acl.putACLEntry(new KiiACLEntry(KiiAnonymousUser.create(), FileAction.READ_EXISTING_OBJECT, true));
			acl.save();
			
			fileUri = kiiFile.toUri();
			Log.d("me", "saved file with URI: " + fileUri.toString());
			
			//add to photos uploaded
			JSONObject photo = new JSONObject();
			photo.put("uri", fileUri.toString());
			photo.put("timestamp", GroupPhotoSync.getServerTime());
			GroupPhotoSync.photosUploaded.put(photo);
			
		} catch (Exception e) {
			Log.e("me", "Unable to upload file", e);
			return;
		}
	}

	public void download(final String uri, final Context ctx) {
		final Object[] myParams = new Object[2];
		new AsyncTask<Void, Void, Void>() {
			@Override
			protected Void doInBackground(Void... params) {
				try{
					Uri uri2 = Uri.parse(uri);
					KiiFile file = KiiFile.createByUri(uri2);
					file.refresh();
					String newFilename = GroupPhotoSync.DOWNLOAD_FILE_PREFIX + file.getTitle().replaceFirst("IMG_", "");
					File destFile = new File(GroupPhotoSync.CAMERA_DIR, newFilename);
					Log.d("me", "downloading file to : " + destFile.getAbsolutePath());
					file.downloadFileBody(destFile.getAbsolutePath());
					Log.d("me", "finished downloading file");

					//force gallery to scan for new photos
					Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
				    File f = new File(destFile.getAbsolutePath());
				    Uri contentUri = Uri.fromFile(f);
				    mediaScanIntent.setData(contentUri);
				    ctx.sendBroadcast(mediaScanIntent);
				    
				    myParams[0] = contentUri;
				    myParams[1] = file.getTitle();
				    
				} catch (Exception e) {
					Log.d("me", "unable to download file", e);
				}
				return null;
			}
			@Override
			protected void onPostExecute(Void param) {
				//Set a notification
				Log.d("me", "adding notification");
				Intent viewPhoto = new Intent(Intent.ACTION_VIEW);
				viewPhoto.setDataAndType( (Uri)myParams[0], "image/*");
				PendingIntent pIntent = PendingIntent.getActivity(ctx, 0, viewPhoto, 0);
				NotificationCompat.Builder mBuilder =
				        new NotificationCompat.Builder(ctx)
					        .setSmallIcon(R.drawable.ic_download)
					        .setContentTitle( (String)myParams[1] + " Downloaded")
					        .setContentText("Touch to view image")
					        .setAutoCancel(true) //clear notification upon being pressed
							.setContentIntent(pIntent);
				NotificationManager mNotificationManager = (NotificationManager)ctx.getSystemService(Context.NOTIFICATION_SERVICE);
				mNotificationManager.notify(1, mBuilder.build());
			}
		}.execute(new Void[0]);
	}
}