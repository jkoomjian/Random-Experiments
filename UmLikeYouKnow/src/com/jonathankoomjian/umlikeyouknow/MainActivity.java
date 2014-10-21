package com.jonathankoomjian.umlikeyouknow;

import java.util.ArrayList;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ToggleButton;



public class MainActivity extends Activity {

	protected static final int REQUEST_OK = 1;
	
	public TextView transcriptionTextView;
	public ScrollView transcriptionScrollView;
	public SpeechRecognizer speechRecognizer;
	public UmRecognitionListener recognitionListener;
	public Intent recognizerIntent;
	private AudioManager audioManager;
	
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        UmUtil.context = getApplicationContext();
        setContentView(R.layout.activity_main);
        
        this.transcriptionTextView = (TextView) findViewById(R.id.textViewTranscription);
        this.transcriptionScrollView = (ScrollView) findViewById(R.id.scrollView1);
        
        ((EditText)findViewById(R.id.editText1)).setOnFocusChangeListener(new UmFocusChangeListener());
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onResume() {
    	super.onResume();
    	Log.d("me", "at onResume");
    }
    
    @Override
    public void onPause() {
		super.onPause();
		cancelSpeechRecognition();
		Log.d("me", "at onPause");
    }
    
	public void onToggleClicked(View view) {
	    // Is the toggle on?
	    boolean on = ((ToggleButton) view).isChecked();
	    if (on) {
	    	Log.d("me", "on/off button toggled on");
	    	//blur filler words EditText
	    	((EditText)findViewById(R.id.editText1)).clearFocus();
	    	hideKeyboard();
	    	startSpeechRecognition();
	    } else {
	    	Log.d("me", "on/off button toggled off");
	    	cancelSpeechRecognition();
	    }
	}
	
	public void startSpeechRecognition() {
		//mute the phone, so the beep doesnt sound
		getAudioManager().setStreamSolo(AudioManager.STREAM_VOICE_CALL, true);

	    if (speechRecognizer == null) {
			if (SpeechRecognizer.isRecognitionAvailable(getApplicationContext())) {
		    	speechRecognizer = SpeechRecognizer.createSpeechRecognizer(getApplicationContext());
		    	recognitionListener = new UmRecognitionListener(this);
		    	speechRecognizer.setRecognitionListener(recognitionListener);
		    } else {
		    	Toast.makeText(getApplicationContext(), "No speech recognizer!", Toast.LENGTH_SHORT).show();
		    	return;
		    }
	    }
	    recognizerIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
	    recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
	    recognizerIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "en-US");
	    recognizerIntent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
	    speechRecognizer.startListening(recognizerIntent);
	}
	
	public void cancelSpeechRecognition() {
		if (speechRecognizer != null) {
			speechRecognizer.stopListening();
			speechRecognizer.destroy();
			speechRecognizer = null;
		}
		
//		audioManager.setStreamMute(AudioManager.STREAM_SYSTEM, false);
		getAudioManager().setStreamSolo(AudioManager.STREAM_VOICE_CALL, false);
	}
	
	
	
	
	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode==REQUEST_OK  && resultCode==RESULT_OK) {
        	ArrayList<String> thingsYouSaid = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
        	transcriptionTextView.append(thingsYouSaid.get(0) + "\n");
        }
    }

    /**
     * A placeholder fragment containing a simple view.
     */
//    public static class PlaceholderFragment extends Fragment {
//
//        public PlaceholderFragment() {
//        }
//
//        @Override
//        public View onCreateView(LayoutInflater inflater, ViewGroup container,
//                Bundle savedInstanceState) {
////            View rootView = inflater.inflate(R.layout.fragment_main, container, false);
//            return rootView;
//        }
//    }
	
	private AudioManager getAudioManager() {
		if (audioManager == null)
			audioManager = (AudioManager) getApplicationContext().getSystemService(Context.AUDIO_SERVICE); 
		return audioManager;
	}
	
	private void hideKeyboard() {
		EditText myEditText = (EditText) findViewById(R.id.editText1);  
		InputMethodManager imm = (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);
		imm.hideSoftInputFromWindow(myEditText.getWindowToken(), 0);
	}
}