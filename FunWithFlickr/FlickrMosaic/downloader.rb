## download files from flickr API

require 'rubygems'
require 'flickraw'

# ruby downloader.rb <flickr_api_key> <flickr_api_secret> <photos_dir>
FlickRaw.api_key=ARGV[0]
FlickRaw.shared_secret=ARGV[1]
@save_dir = ARGV[2]
@count = 0
@page = 1

while (@count < 528)
  photos = flickr.photos.search(
                                :text => 'seattle', 
                                :lat => '47.629508', 
                                :lon => '-122.359972', 
                                :radius => '1', 
                                :content_type => '1', 
                                :per_page => '500', 
                                :page => @page)
  # puts "results: " + photos.size.to_s
  photos.each() {|i| 
    
    # puts "\n" + i.inspect
    
    #get the size
    sizes = flickr.photos.getSizes(:photo_id => i.id)
    sizes.each(){|s|
      # if (s.label == "Large" || s.label == "Original") 
      # end
      
      if (s.label == "Large" && s.width == "1024" && (s.height == "683" || s.height == "682"))
        #get the image
        puts i.id + ": " + s.label + ": " + s.width.to_s + "x" + s.height.to_s + ": " + s.source
        
        #save the image
        # puts "wget -O #{@save_dir}/#{@count}.jpg #{s.source}"
        `wget -O #{@save_dir}/#{@count.to_s.rjust(3, "0")}.jpg #{s.source}`
        @count += 1
  
      end
    }
  }
  
  @page += 1
end