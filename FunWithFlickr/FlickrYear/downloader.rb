## download files from flickr API
require 'rubygems'
require 'flickraw'
require 'date'


# ruby downloader.rb <flickr_api_key> <flickr_api_shard_secret> <dest_dir>
FlickRaw.api_key=ARGV[0]
FlickRaw.shared_secret=ARGV[1]
@save_dir = ARGV[2]
@count = 0
@page = 1
@photo_limit = 15
@page_size = 50

def get_photos_for_day(min_date, max_date)
  photo_set = []

  photos = flickr.photos.search(
                                :text => 'central park', 
                                :lat => '40.776093', 
                                :lon => '-73.970754', 
                                :radius => '1', 
                                :content_type => '1', 
                                :min_taken_date => "#{min_date} 00:00:00",
                                :max_taken_date => "#{max_date} 00:00:00",
                                :extras => 'date_taken',
                                :per_page => @page_size, 
                                :page => @page)
  puts "results: " + photos.size.to_s
  
  photos.each() {|i| 
    puts "\n" + i.inspect
    #get the size
    sizes = flickr.photos.getSizes(:photo_id => i.id)
    sizes.each(){|s|
      # puts i.id + ": " + s.label + ": " + s.width.to_s + "x" + s.height.to_s + ": " + s.source
      if (s.label == "Large Square")
        puts "good image " + i.id + ": " + s.label + ": " + s.width.to_s + "x" + s.height.to_s + ": " + s.source
        photo_set << {:url => s.source, :flickr_id => i.id}
      end
    }
  }
    
  return photo_set
end

def save_image(url, date_taken, day_of_year, flickr_id)
  puts "wget -O #{@save_dir}/#{day_of_year.to_s.rjust(3, '0')}-#{date_taken}-#{flickr_id}.jpg #{url}"
  `wget -qO #{@save_dir}/#{day_of_year.to_s.rjust(3, '0')}-#{date_taken}-#{flickr_id}.jpg #{url}`
end

def get_photos_for_dates(start_date, end_date)
  count = 0
  while start_date <= end_date
    begin
      puts "get_photos_for_day(#{start_date.to_s}, #{start_date.next.to_s}, #{start_date.yday})"
      photo_set = get_photos_for_day(start_date.to_s, start_date.next.to_s)
      photo_set.each(){|p|
        save_image(p[:url], start_date.to_s, start_date.yday, p[:flickr_id])
      }
    rescue
      puts "error on date #{start_date}"
    end

    start_date = start_date.next
  end
end


## Testing
# get_photos_for_day('2012-07-13', '2012-07-14', 0)
# save_image('http://farm9.staticflickr.com/8012/7688507326_a544d58fb6_q.jpg', '2012-07-13', 1)
get_photos_for_dates(Date.new(2006, 1, 1), Date.new(2006, 12, 31))