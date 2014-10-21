#!/usr/local/bin/ruby

require 'uri'
require 'net/http'

#-------------- Adjust This! --------------#
#set this as a command line parameter or leave the default
@dest_playlist_file_dir = "/home/jonathan/projects/XRT/"
@dest_playlist_file_name = "playlist-#{Time.now.strftime('%Y%m%d')}.m3u"
@xrt_playlist_url = "http://www.mediabase.com/whatsong/whatsong.asp?var_s=087088082084045070077"

#-------------- Below Shouldn't Be Touched --------------#
@all_songs = {}

#-------------- Helpers --------------#
def get_url(url)
  return Net::HTTP.get( URI.parse( url ) )
end

def get_url_w_headers(url, headers)
  parseduri = URI.parse(url)
  req = Net::HTTP::Get.new(url)
  headers.each{|s| req.add_field(s[0], s[1])  }
  res = Net::HTTP.new(parseduri.host, parseduri.port).start do |http|
    http.request(req)
  end
  return res.body
end

def get_songs_from_xrt_page(src)
  songs = []
  restr = "<td nowrap><span class=blackMain11px>(.+?)</td>.*?<td nowrap><span class=blackMain11px>(.+?)</td>.*?</tr>"
  re = Regexp.new(restr, 5) #5 = Regexp::IGNORECASE(1) and Regexp::MULTILINE(4) or'ed together
  m = src.scan(re)
  m.each{|s| 
    #puts s[0] + " - " + s[1]
    songs << {"artist" => s[0], "title" => s[1]}
  }
  
  return songs
end

#--------- Get MP3 URL----------
def get_mp3_url(title, artist)
  song_urls = get_song_urls_from_search_results( download_mp3_search(title, artist) )
  puts "Found #{song_urls.length} search results for #{artist} - #{title}"
  ##get all the good urls for a song, and pick one at random - this mixes it up more 
  good_song_urls = [];
  
  good_song_count = 0 #we dont need more than 10 good songs
  song_urls.each{|url|
    if good_song_count >= 10 then break end
    #mp3details = get_mp3_details_from_page( get_url(song_url) ) #mp3hunt.com
    #url = mp3details["url"]
    if url && is_url_good(url)
      puts "GOOD URL #{url}"
      good_song_urls << url
      good_song_count = good_song_count + 1
    else
      puts "BAD URL #{url}"
    end
  }
  
  if good_song_urls.length > 0
    puts "found #{good_song_urls.length} good songs"
    return good_song_urls[ rand( good_song_urls.length ) ]; 
  else
    return nil
  end
  
end

def download_mp3_search(title, artist)
  #url = "http://mp3realm.org/search?q=#{URI.escape(artist)}+#{URI.escape(title)}&pp=25"
  #url = "http://skreemr.com/advanced_results.jsp?advanced=true&song=#{URI.escape(title)}&artist=#{URI.escape(artist)}&album=&genre=&bitrate=0&length=00%3A00%3A60&button=SkreemR+Search"
  url = "http://mp3skull.com/mp3/#{URI.escape(artist.gsub(/\s/, '_'))}_#{URI.escape(title.gsub(/\s/, '_'))}.html"
  headers = {
              "User-Agent" => " Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.16) Gecko/20110319 Firefox/3.6.16",
              "Accept" => "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Accept-Language" => "en-us,en;q=0.5",
              "Accept-Charset" => "ISO-8859-1,utf-8;q=0.7,*;q=0.7"
            }
  return get_url_w_headers(url, headers)
end

def get_song_urls_from_search_results(src)
  ids = Array.new
  
  ## mp3hunt.com
#  ids = src.scan(/<a class="songurl" href='url\?id&#61;(.+?)'>/im).to_a()
#  ids.each{|id| ids2 << "http://mp3realm.org/url?id=#{id}"}

  #skreemr
  #ids = src.scan(/<param name="FlashVars".*?soundFile=(http.+?\.mp3)'>/im).to_a()
  #ids.each{|id| ids2 << URI.unescape(id[0])}
  
  #mp3skull
  src.scan(/<a href="(http\S+?\.mp3)"[^>]*?>Download<\/a>/im) {|w|
    ids << URI.unescape(w[0])
  }
  return ids
end

#mp3hunt.com
#def get_mp3_details_from_page(src)
#  return {
#    "url" => get_first_match(/<a title="Download.+?" href="(.+?)">\s*?<font color='#1875bf' size='2'>\s*?<b>(Download MP3)<\/b>\s*?<\/font>\s*?<\/a>/im, src),
#    "playtime" => get_first_match(/<li>\s*<B>Playtime:<\/B>\s*:\s?(\d\d:\d\d)\s*<\/li>/im, src)
#  }
#end

def is_unique_song(title, artist)
  key = "#{artist} - #{title}"
  if @all_songs.has_key?(key)
    return false
  else
    @all_songs[key] = 1
    return true
  end
end

def is_url_good(url)
#  url = urldetails["url"]

  #make sure this is not a preview song (playtime > 1min)
#  if (urldetails["playtime"] =~ /00:/) != 0

    #make sure this is an recognized file format
    if (url =~ /.mp3$/i)
  
      begin
          #make sure the file at the url exists
          response = nil
          parseduri = URI.parse(url)
          http = Net::HTTP.new(parseduri.host, 80)
          http.open_timeout = http.read_timeout = 5  #Give up after 5 secs
          http.start(){|http|
            response = http.head(parseduri.path)
          }
          if (response.code =~ /2/) == 0 
            return true
          end
        
      rescue #rescues all standard errors
      rescue Timeout::Error => e #rescues timeout exceptions - everything extends from Exception class, but you don't want to catch that b/c it will get compliation errors
      rescue Exception
      end
    end
#  end
  
  return false
end

def build_playlist(songs)
  output = "#EXTM3U"
  
  0.upto(songs.length-1) do|s|
    curr_song = songs[s]
    if is_unique_song(curr_song['artist'], curr_song['title'])
      mp3url = get_mp3_url(curr_song["title"], curr_song["artist"])
      if mp3url
        output += "\n\n#EXTINF:-1,#{curr_song['artist']} - #{curr_song['title']}\n#{mp3url}"
        puts "#{s}. #{curr_song['artist']} - #{curr_song['title']} - #{mp3url}"
      end
    end
  end
  
  return output
end

#-------------- Helper Methods ------------------
def get_first_match(regexp, src)
  m = regexp.match(src).to_a()
  if m.length > 1
    return m[1]
  else
    return nil
  end
end

#------------------ Run
def run()
  if ARGV.length > 0 then @dest_playlist_file_dir = ARGV[0] end
  
  songs = get_songs_from_xrt_page( get_url(@xrt_playlist_url) )
  playlist = build_playlist(songs)
  File.open(@dest_playlist_file_dir + @dest_playlist_file_name, "w") do |file|
    file.write(playlist)
  end
  
  #update playlist.m3u link
  `rm -f #{@dest_playlist_file_dir + "playlist.m3u"}`
  `ln -s #{@dest_playlist_file_dir + @dest_playlist_file_name} #{@dest_playlist_file_dir + "playlist.m3u"}`
  
end

#-------------- Start! --------------#
run()