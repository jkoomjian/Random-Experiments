## download files from flickr API
require 'rubygems'
require 'flickraw'
require 'date'


# ruby downloader.rb <flickr_api_key> <flickr_api_shard_secret> <dest_dir>
FlickRaw.api_key=ARGV[0]
FlickRaw.shared_secret=ARGV[1]
@save_dir = ARGV[2]
@page_size = 50

$start_year = 2005
$end_year = 2014
$max_photos_per_day = 35


def get_photos_for_day(day_in_year)
  photo_set = []
  curr_year = $end_year

  while $start_year <= curr_year && photo_set.size < $max_photos_per_day
    curr_day = Date.ordinal(curr_year, day_in_year)

    photos = flickr.photos.search(
                                  :text => 'farm OR field',
                                  # :lat => '41.828642', 
                                  # :lon => '-93.510132', 
                                  # :radius => '32', 
                                  :bbox => '-95.734863, 40.647304, -90.329590, 43.548548',
                                  :content_type => '1', 
                                  :min_taken_date => "#{curr_day} 00:00:00",
                                  :max_taken_date => "#{curr_day + 1} 00:00:00",
                                  :extras => 'date_taken',
                                  :per_page => @page_size, 
                                  :page => 1,
                                  # :geo_context => 2
                                  )
    puts "results for #{curr_day}: " + photos.size.to_s

    photos.each() do |i| 
      puts "\n" + i.inspect
      #get the size
      sizes = flickr.photos.getSizes(:photo_id => i.id)
      sizes.each(){|s|
        # puts i.id + ": " + s.label + ": " + s.width.to_s + "x" + s.height.to_s + ": " + s.source
        if (s.label == "Large Square")
          puts "good image " + i.id + ": " + s.label + ": " + s.width.to_s + "x" + s.height.to_s + ": " + s.source
          photo_set << {:url => s.source, :flickr_id => i.id, :date => curr_day}
        end
      }
    end

    # inc. year
    curr_year -= 1
  end

  return photo_set
end

def save_image(url, date_taken, day_of_year, flickr_id)
  puts "wget -O #{@save_dir}/#{day_of_year.to_s.rjust(3, '0')}-#{date_taken}-#{flickr_id}.jpg #{url}"
  `wget -qO #{@save_dir}/#{day_of_year.to_s.rjust(3, '0')}-#{date_taken}-#{flickr_id}.jpg #{url}`
end

def get_photos_for_dates()
  curr_date = 1
  while  curr_date <= 365
    begin
      get_photos_for_day(curr_date).each(){|p|
        save_image(p[:url], p[:date], curr_date, p[:flickr_id])
      }
    rescue => e
      puts "error on date #{curr_date}"
      puts e
    ensure
      curr_date += 1
    end
  end
end


## Testing
# get_photos_for_day('2012-07-13', '2012-07-14', 0)
# save_image('http://farm9.staticflickr.com/8012/7688507326_a544d58fb6_q.jpg', '2012-07-13', 1)
get_photos_for_dates()