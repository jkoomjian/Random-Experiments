package com.jonathankoomjian.umlikeyouknow;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.widget.Toast;

public class UmRecognizerService extends Service {

	public SpeechRecognizer sr;
	public UmRecognitionListener recognitionListener;
	
	@Override
	public void onCreate() {
		super.onCreate();
		
//	    if (sr == null) {
//			if (SpeechRecognizer.isRecognitionAvailable(getApplicationContext())) {
//		    	sr = SpeechRecognizer.createSpeechRecognizer(getApplicationContext());
//		    	recognitionListener = new UmRecognitionListener(this);
//		    	sr.setRecognitionListener(recognitionListener);
//		    } else {
//		    	Toast.makeText(getApplicationContext(), "No speech recognizer!", Toast.LENGTH_SHORT).show();
//		    	return;
//		    }
//	    }
//	    Intent ri = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
//	    ri.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
//	    ri.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "en-US");
//	    ri.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
//	    sr.startListening(ri);
	}
	
	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}
	
}
