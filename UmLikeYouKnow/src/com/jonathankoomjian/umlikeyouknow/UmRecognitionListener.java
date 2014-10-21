package com.jonathankoomjian.umlikeyouknow;

import java.util.ArrayList;
import java.util.Iterator;

import android.content.Context;
import android.media.AudioManager;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.SpeechRecognizer;
import android.util.Log;
import android.widget.ScrollView;
import android.widget.Toast;

public class UmRecognitionListener implements RecognitionListener {

	private MainActivity activity;
	private String textSoFar = "";

	public UmRecognitionListener(MainActivity activity) {
		this.activity = activity;
	}
	
	public void onBeginningOfSpeech(){
	}
	
	public void onReadyForSpeech(Bundle params) {
		Log.d("me", "onReady: " + params.toString());
		printBundle(params);
	}

	public void onBufferReceived(byte[] buffer) {
		Log.d("me", "onbufferreceived: " + buffer);
	}
	
	public void onEndOfSpeech() {
		Log.d("me", "onendofspeech");
	}
	
	public void onError(int error){
		Log.d("me", "onError: " + error);
		if (error == 8) {
			Toast.makeText(activity, "Error communicating with text engine, stupid text engine is busy.", Toast.LENGTH_SHORT).show();
			activity.speechRecognizer.stopListening();
		} else {
			restartListener(); //this is probably a bad idea, but onError is called often
		}
	}
	
	public void onEvent(int eventType, Bundle params) {}
	
	public void onPartialResults(Bundle partialResults) {
		Log.d("me", "onPartialResults: " + bundleToString(partialResults));
		setDisplayText(partialResults, false);
	}
	
	public void onResults(Bundle results) {
        Log.d("me", "onResults: "+ bundleToString(results));
        setDisplayText(results, true);
        restartListener();
	}

	public void onRmsChanged(float rmsdB) {}

	
	
	
	/*------------  Private  -----------*/
	
	private void restartListener() {
		this.activity.speechRecognizer.stopListening();
		this.activity.speechRecognizer.cancel();
		this.activity.speechRecognizer.startListening(this.activity.recognizerIntent);
		Log.d("me", "just restarted the listener");
	}
	
	private String bundleToString(Bundle b) {
		String str = "";
		ArrayList data = b.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
        if (data.size() > 0) str = data.get(0).toString();
        return str;
	}
	
	private void printBundle(Bundle b) {
		Iterator<String> keys = b.keySet().iterator();
		while (keys.hasNext()) {
			String key = keys.next();
			Object value = b.get(key);
			Log.d("me", "bundle value: "+ key + ": " + value);
		}
	}
	
	private void setDisplayText(Bundle b, boolean isCompleteResult) {
		setDisplayText(bundleToString(b), isCompleteResult);
	}
	
	//isCompleteResult - is this a result from a completed sentence (as opposed to a partial result?)
	private void setDisplayText(String str, boolean isCompleteResult) {
		//save if complete result
		if (isCompleteResult) {
			textSoFar += str + ". ";
			str = "";
		}
		
        //Update text
        activity.transcriptionScrollView.fullScroll(ScrollView.FOCUS_DOWN);
        activity.transcriptionTextView.setText(textSoFar + str);
        
        UmUtil.checkForFillerWords(textSoFar + str);
	}
}
