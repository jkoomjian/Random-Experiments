#!/usr/local/bin/ruby

require 'xrt'

def test_get_url()
  puts get_url(@xrt_playlist_url)
end

def test_get_url_w_headers()
  url = "http://skreemr.com/advanced_results.jsp?advanced=true&song=%22COME+TOGETHER%22&artist=%22THE+BEATLES%22&album=&genre=&bitrate=0"
  headers = [["Accept-Language", "en-us,en;q=0.5"]]
  puts get_url_w_headers(url, headers)
  #puts get_url_w_headers("http://www.jonathankoomjian.com/stuff/test.txt", [])
end

def test_get_songs() 
  songs = get_songs_from_xrt_page( get_url(@xrt_playlist_url) )
  0.upto(songs.length-1) do|s|
    curr_song = songs[s]
    puts "#{s}. #{curr_song['artist']} - #{curr_song['title']}"
  end
end

def test_download_mp3_search()
  puts download_mp3_search("COME TOGETHER", "THE BEATLES")
end

def test_get_song_urls_from_search_results()
  urls =  get_song_urls_from_search_results( download_mp3_search("COME TOGETHER", "THE BEATLES") )
  puts "found #{urls.length} results"
  urls.each{|url| puts "\n\n###############################\n" + url + "\n###############################\n\n"}
end

def test_get_mp3_details_from_page()
  #puts IO.read("/home/jonathan/projects/XRT/v2/song_page.html")
  song_urls = get_song_urls_from_search_results( download_mp3_search("COME TOGETHER", "THE BEATLES") )
  puts song_urls[0]
  #File.open("/home/jonathan/projects/XRT/v2/song_page2.html", 'w') {|f| f.write( get_url(song_url) ) }
  details = get_mp3_details_from_page( get_url(song_urls[0]) )
  puts "URL: #{details['url']}"
  puts "PLAYTIME: #{details['playtime']}"
end

def test_build_playlist()
  songs = get_songs_from_xrt_page( get_url(@xrt_playlist_url) )
  puts "playlist:\n\n" + build_playlist(songs)
end

def test_write()
  File.open("/home/jonathan/projects/XRT/testm3u2.txt", "w") do |file|
    file.write("hello world")
  end
end

def test_date_write()
  puts Time.now.strftime("%Y%m%d")
end

def test_is_url_good()
  #puts is_url_good("http://angam.ang.univie.ac.at/class/ko/Dylan/Bob%20Dylan%20-%20Like%20a%20Rolling%20Stone.mp3")
  #puts is_url_good("http://handhelds.org/feeds/mipv6-phase1/Jimi_Hendrix-Purple_Haze.mp3")
  puts get_first_match(/<li>\s*<B>Playtime:<\/B>\s*:\s?(\d\d:\d\d)\s*<\/li>/im, get_url("http://mp3realm.org/url?id=MzM2NzMzfDY2MjE4MA=="))
end

def test_get_mp3_url()
  result = get_mp3_url("sometime around midnight", "");
  puts "url: " + result["url"]
  puts "playtime: " + result["playtime"]
end

#------- Start! -------------#
#test_get_url()
#test_get_url_w_headers()
#test_get_songs()
#test_get_mp3_details_from_page()
test_build_playlist()
#test_write()
#test_date_write()
#test_download_mp3_search()
#test_get_song_urls_from_search_results()
#test_is_url_good()
#test_get_mp3_url()