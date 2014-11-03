require 'flickraw'
require 'date'

# ruby generate_map.rb <flickr_api_key> <flickr_api_secret> <photos_dir>
FlickRaw.api_key=ARGV[0]
FlickRaw.shared_secret=ARGV[1]

# The distance of a degree of lat decreases as you approach the poles
# To keep the x,y calculations correct, we must correct for this
# Get the distance of a degree of lat, lng from
# http://www.csgnetwork.com/degreelenllavcalc.html
# For large areas, use the average longitude -> (($bbox[3] - $bbox[1]) / 2) + $bbox[1]

# Empty background maps can be found at
# https://a.tiles.mapbox.com/v4/jkoomjian.k11lpo1d/page.html?access_token=pk.eyJ1Ijoiamtvb21qaWFuIiwiYSI6IjBCY1BIdkUifQ.pJuu1vRHE1KE45EY--JwRw#13/41.5981/-93.6121


# $tags = "seattle"
# $bbox = [-122.44176864624022, 47.56922957853297, -122.2587776184082, 47.694050002541715]
# $scale = 9000
# $max_num_imgs = 20000
# $dist_m_deg_lat = 111181.90
# $dist_m_deg_lng = 75244.44
# $save_dir = "sea3"

# $tags = "desmoines"
# $bbox = [-93.666945, 41.562931, -93.596907, 41.601195]
# $scale = 20000
# $max_num_imgs = 3000
# $dist_m_deg_lat = 111065.52
# $dist_m_deg_lng = 83366.03
# $save_dir = "dsm2"

# $tags = "iowa"
# $bbox = [-96.64672851562499, 40.34654412118006, -89.967041015625, 43.59630591596548]
# $scale = 250
# $max_num_imgs = 20000
# $dist_m_deg_lat = 111072.70
# $dist_m_deg_lng = 82887.79
# $save_dir = "iowa"

# $tags = "wyoming"
# $bbox = [-111.04705810546874, 40.997520497401055, -104.0570068359375, 44.99782485158904]
# $scale = 300
# $max_num_imgs = 40000
# $dist_m_deg_lat = 111092.66
# $dist_m_deg_lng = 81544.02
# $save_dir = "wy1"

$tags = "washington"
$bbox = [-125.15625000000001, 45.52944081525666, -116.54296874999999, 49.1170290407793]
$scale = 200
$max_num_imgs = 20000
$dist_m_deg_lat = 111177.11
$dist_m_deg_lng = 75596.07
$save_dir = "wa"


## Dont Modify Below ##
$circle_r = 2
$bg_color = "white"

$ratio_lat_lng = $dist_m_deg_lng / $dist_m_deg_lat
# puts "ratio: #{$ratio_lat_lng}"
$w = (($bbox[2] - $bbox[0]) * $scale * $ratio_lat_lng).ceil
$h = (($bbox[3] - $bbox[1]) * $scale).ceil
puts "Img size: #{$w}x#{$h}"
$imgs = []
# only allow a max of 10 imgs per owner
$owners = {}
$page = 1


# Flickr only provides 16 pages (~4250 imgs) before repeating
# if $max_num_imgs > 4000, then divide the map into smaller segments
# so that each segment requires < 4000 imgs
$num_segs = 1
$max_num_imgs_per_seg = $max_num_imgs
$start_lat = $bbox[0]
$end_lat = $bbox[2]
$round_amt = $bbox[1].to_s.size - 3 ## TODO
$flickr_max = 500
$lat_inc = 0
if ($max_num_imgs > $flickr_max)
	$num_segs = ($max_num_imgs.to_f / $flickr_max).ceil
	$lat_inc = (($bbox[2] - $bbox[0]) / $num_segs).round($round_amt)
	$bbox[2] = ($bbox[0] + $lat_inc).round($round_amt)
	$max_num_imgs_per_seg = ($max_num_imgs.to_f / $num_segs).ceil
end
puts "num segs: #{$num_segs}, imgs per seg: #{$max_num_imgs_per_seg}"

def get_imgs()
	imgs_in_seg = 0

	while $imgs.size < $max_num_imgs
	    photos = flickr.photos.search(
	    							  :tags => $tags,
	                                  # :text => '',
	                                  :bbox => "#{$bbox.join(', ')}",
	                                  :content_type => '1', 
	                                  :sort => 'interestingness-desc',
	                                  :extras => "geo, url_sq, url_l",
	                                  :per_page => [$max_num_imgs_per_seg, 250].min,
	                                  :page => $page
	                                  )
	    puts "results: #{photos.size} page: #{$page} w/lat_inc #{$lat_inc} w/bbox: #{$bbox.join(', ')}"
	    # if photos.size == 0 then return end

		photos.each() do |i| 
	  		puts "\nimg: " + i.inspect
	  		$owners[i.owner] = ($owners[i.owner] || 0) + 1
	  		# puts "\nowner: " + $owners.inspect
	  		# if $owners[i.owner] < 100
			`wget -nc -O #{$save_dir}/#{i.id}.jpg #{i.url_sq}`
			add_circle_to_params("#{$save_dir}/#{i.id}.jpg", i)
			imgs_in_seg += 1
	  		puts "\nimg#: #{$imgs.size} in seg: #{imgs_in_seg}" 

			# if the num of photos downloaded != photos.size, photos from flickr are repeating
			# this happens on page 17, or when the search runs out of results
			# num_downloaded = `ls -1 #{$save_dir} | wc -l`.to_i
			# if $imgs.size != num_downloaded
			# 	puts "Num. of imgs in info array(#{$imgs.size}) and downloaded(#{num_downloaded}) do not match"
			# 	$imgs.pop
			# 	photos = []
			# 	break
			# end


			# end
		end

		$page += 1

		# the results begin repeating on the 17th page
		# check if we need to switch to the next lat_seg
		# or we ran out of imgs for a segment
		if imgs_in_seg >= $max_num_imgs_per_seg || photos.size == 0
			$bbox[0] = $bbox[2]
			$bbox[2] = ($bbox[2] + $lat_inc).round($round_amt)
			$page = 1
			imgs_in_seg = 0

			# make sure we have not reached the end
			if $bbox[2] > $end_lat then return end
		end


	end
end

def add_circle_to_params(img_filepath, img)
	url = (defined? img.url_l) ? img.url_l : img.url_sq
	x = ((img.longitude - $start_lat) * $scale * $ratio_lat_lng).ceil
	y = (($bbox[3] - img.latitude) * $scale).ceil  # y is calculated from the top of the img
	$imgs << {:color => get_img_color(img_filepath), :circle_params => get_img_circle_param(x, y),
				:x => x, :y => y, :filepath => img_filepath, :url => url}
end

def get_img_color(img_filepath)
	`convert #{img_filepath} -format %c -depth 8  histogram:info:histogram_image.txt`
	return `sort -n histogram_image.txt | tail -1`.gsub(/.*\s(#\S\S\S\S\S\S)\s.*/, '\1').strip
end

def get_img_circle_param(x, y)
	# x,y start at upper left
	return "#{x},#{y} #{x + $circle_r},#{y}"
end

def generate_map_img
	file_name = "map-#{DateTime.now.strftime("%Y%m%d_%H%M%S")}.png"

	# generate blank img
	cmd = "convert -size #{$w}x#{$h} xc:#{$bg_color} #{file_name}"
	puts cmd
	`#{cmd}`

	$imgs.each do |img|

		# add each dot, one at a time, varying the color
		cmd = "convert -size #{$w}x#{$h} xc:#{$bg_color} -fill '#{img[:color]}' -draw 'image SrcOver 0,0 0,0 #{file_name} circle #{img[:circle_params]}' #{file_name}"
		puts cmd
		`#{cmd}`
	end
end

def generate_map_html
	file_name = "dataset-#{$tags}.js"
	open(file_name, 'w') { |f|
		f.puts "//x, y, color, img_filepath, flickr_url"
 		f.puts "var #{$tags} = ["
 		$imgs.each { |img|
 			f.puts "\t[#{img[:x]}, #{img[:y]}, '#{img[:color]}', '#{img[:filepath]}', '#{img[:url]}'],"
 		}
 		f.puts "];"
	}
end


get_imgs()
# generate_map_img()
generate_map_html()