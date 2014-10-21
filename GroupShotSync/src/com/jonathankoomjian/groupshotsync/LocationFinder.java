package com.jonathankoomjian.groupshotsync;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import android.content.Context;
import android.location.Location;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesClient;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.location.LocationClient;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;

public class LocationFinder implements GooglePlayServicesClient.ConnectionCallbacks, GooglePlayServicesClient.OnConnectionFailedListener, LocationListener {

	private Context ctx;
	private LocationClient locationClient;
	private List<Integer> locationAccuracies = new ArrayList<Integer>();
	
	protected LocationFinder(Context ctx) {
		super();
		this.ctx = ctx;
		locationClient = new LocationClient(this.ctx, this, this);
	}
	
	/* Main method - kicks off location update thread */
	public void find() {
		if (!this.verifyGooglePlayExists()) return;	
		this.locationClient.connect();
	}
	
	/**
	 * Return true or false depending on if google play services exist.
	 * If they do not exist, display a toast message.
	 */
    public boolean verifyGooglePlayExists() {
        // Check that Google Play services is available
        int resultCode = GooglePlayServicesUtil.isGooglePlayServicesAvailable(this.ctx);
        // If Google Play services is available
        if (ConnectionResult.SUCCESS == resultCode) {
            // In debug mode, log the status
            Log.d("Location Updates", "Google Play services is available.");
            return true;
        } else {
        	// Google Play services was not available for some reason
            // Get the error dialog from Google Play services
        	String msg = "Unable to determine location: " + GooglePlayServicesUtil.getErrorString(resultCode);
        	Toast.makeText(this.ctx, msg, Toast.LENGTH_LONG).show();
        	Log.e("me", "Google Play Services not found!");
            return false;
        }
    }

    /*-------- Callbacks ------------------*/
    
    
    /* Called by Location Services when the request to connect the
     * client finishes successfully. At this point, you can
     * request the current location or start periodic updates */
    @Override
    public void onConnected(Bundle dataBundle) {
    	Location loc = locationClient.getLastLocation();
    	this.saveLatestLocation(this.ctx, loc);
    	this.startLocationRequests();
    }

    /* Called by Location Services if the connection to the
     * location client drops because of an error. */
    @Override
    public void onDisconnected() {
        // Display the connection status
        //Toast.makeText(this.ctx, "Disconnected. Please re-connect.", Toast.LENGTH_LONG).show();
    }

    /* Called by Location Services if the attempt to
     * Location Services fails. */
    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {
    	//String msg = "Unable to determine location: " + GooglePlayServicesUtil.getErrorString(connectionResult.getErrorCode());
    	//Toast.makeText(this.ctx, msg, Toast.LENGTH_LONG).show();
    }
    
    /* Location listener callbacks */
    @Override
    public void onLocationChanged(Location loc) {
    	this.saveLatestLocation(this.ctx, loc);
    	checkToContinueLocationUpdates(loc);
    }
    
    public void saveLatestLocation(Context ctx, Location loc) {
    	if (loc == null) {
    		//Toast.makeText(ctx, "Unable to retreive location", Toast.LENGTH_LONG).show();
    		return;
    	}
    	Log.d("me", "latest location: " + loc.getLatitude() + ", " + loc.getLongitude() + ", " + loc.getAccuracy());
    	
		GroupPhotoSync.setInPreferences("last_location_lat", loc.getLatitude() + "", ctx);
		GroupPhotoSync.setInPreferences("last_location_lon", loc.getLongitude() + "", ctx);
    }

    /* Stop updating the location once our accuracy has plateaued */
    public void checkToContinueLocationUpdates(Location loc) {
    	int currAccuracy = (int)Math.round(loc.getAccuracy() * 100);
    	if (this.locationAccuracies.size() < 10) {
    		this.locationAccuracies.add(currAccuracy);
    		return;
    	}
    	
    	//has currAccuracy improved in the last 3 lookups? If not, stop.
    	if (currAccuracy < this.locationAccuracies.get( this.locationAccuracies.size() - 3 )) {
    		this.locationAccuracies.add(currAccuracy);
    		Log.d("me", "curr accuracies: " + Arrays.toString(this.locationAccuracies.toArray()) + " curr acc: " + currAccuracy);
    	} else {
    		//time to stop
    		Log.d("me", "stopping w/acc: " + currAccuracy + " all accs: " + Arrays.toString(this.locationAccuracies.toArray()));
    		stopLocationRequests();
    	}
    }
    
    /*------- Location Methods -----------*/

    public void startLocationRequests() {
    	LocationRequest locationRequest = LocationRequest.create();
    	// Use high accuracy
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        // Set the update interval to 5 seconds
        locationRequest.setInterval(5 * 1000);
        // Set the fastest update interval to 1 second
        locationRequest.setFastestInterval(1 * 1000);
        this.locationClient.requestLocationUpdates(locationRequest, this);
    }
    
    public void stopLocationRequests() {
    	if (locationClient.isConnected()) {
    		this.locationClient.removeLocationUpdates(this);
    		locationClient.disconnect();
    	}
    }
}