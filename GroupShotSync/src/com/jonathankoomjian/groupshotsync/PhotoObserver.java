package com.jonathankoomjian.groupshotsync;

import java.util.Timer;
import java.util.TimerTask;

import android.os.FileObserver;
import android.util.Log;
import android.widget.Toast;

public class PhotoObserver extends FileObserver {

	private Runnable doUpdateGUI = new Runnable() {
		public void run() {
			Toast.makeText(GroupPhotoSync.appCtx, "Uploading photo", Toast.LENGTH_SHORT).show();
		}
	};

	public PhotoObserver() {
		super(GroupPhotoSync.CAMERA_DIR, FileObserver.CREATE);
		Log.d("photo observer", "photo obs. created w/path=" + GroupPhotoSync.CAMERA_DIR);
	}
	
	@Override
	public void onEvent(int event, final String path) {
		//verify this is a real image file
		if (path != null && 
				path.toLowerCase().matches(".*?\\.(png|jpg|jpeg|mp4|avi)") &&
				!path.toLowerCase().startsWith(GroupPhotoSync.DOWNLOAD_FILE_PREFIX.toLowerCase())
				) {
			Log.d("photo observer", "onEvent with " + event + " path=" + path);

			//notify user we are uploading - must use UI thread
			try{
				((GroupPhotoSync)GroupPhotoSync.appCtx.getApplicationContext()).uiHandler.post(this.doUpdateGUI);
			} catch (Exception e) {
				Log.e("me", "Error displaying upload toast", e);
			}
			
			//delay for 3sec to make sure the photo has finished saving
			//TODO poll every 300ms get file size, when size stops increasing call FileTransport
			//will need to do this for videos
			new Timer().schedule(new TimerTask() {
				@Override
				public void run() {
					Log.d("me", "done sleeping, calling file transport!");
					new FileTransport().send(path);
				}
			}, 3000);
		}
	}
}
