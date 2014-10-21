package com.jonathankoomjian.umlikeyouknow;

import java.util.HashMap;
import java.util.Map;

import android.content.Context;
import android.os.Vibrator;
import android.util.Log;

public class UmUtil {

	/* A place to store commonly used data */ 
	public static Context context;
	private static Map<String, Integer> fillerWords;
	
	public static boolean checkForFillerWords(String txt) {
		boolean hasWord = false;
		txt = txt.toLowerCase();
		
		//check 
		for(String word : fillerWords.keySet()) {
			Log.d("me", "checking word: " + word);
			
			int wordOccurancesInText = txt.split(word).length - 1;
			int wordOccurancesSoFar = fillerWords.get(word);
			
			if (wordOccurancesInText > wordOccurancesSoFar) {
				//save new occurrences count
				fillerWords.put(word, wordOccurancesInText);
				//filler word found, vibrate phone
				Vibrator v = (Vibrator)context.getSystemService(context.VIBRATOR_SERVICE);
				v.vibrate(new long[]{0, 200, 50, 200}, -1);
				hasWord = true;
			}
		}
		
		return hasWord;
	}
	
	public static void setFillerWords(String[] words) {
		UmUtil.fillerWords = new HashMap<String, Integer>();
		for (String word : words) {
			if ("".equals(word)) continue;
			word = word.trim().toLowerCase();
			UmUtil.fillerWords.put(word, 0);
			Log.d("me", "filler word: " + word);
		}
	}
}