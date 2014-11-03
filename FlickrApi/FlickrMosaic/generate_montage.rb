require 'date'

## Generate a composite image 
@count = 0
@img_dir = ARGV[0]
@working_dir = @img_dir + "/working"

@full_img_width = 1024
@full_img_height = 682
@curr_column = 0
@curr_row = 0

# @segment_width = 128
# @segment_height = 682
# @segment_height = 341
# @segment_width = 64
# @segment_height = 62
@segment_width = 2
@segment_height = 2
@img_count = 0

def increment_position()
  @curr_column += 1
  
  # are we past the end of the image?
  if ((@curr_column * @segment_width) >= @full_img_width)
    @curr_column = 0
    @curr_row += 1
  end
end

## Create image segments
def slice_imgs
  ##Get img names
  imgs = []
  
  Dir.foreach(@img_dir){|f| if (f =~ /\.jpg/) then imgs << f end }
  
  ##Create cropped version
  prev_img = ''
  while (@img_count < ((@full_img_width / @segment_width) * (@full_img_height / @segment_height)))
    ## do it this way so we get a proper random sampling of the images
    curr_img = imgs[ Kernel.rand(imgs.length) ]
    
    # make sure we dont get the same image twice in a row
    if (curr_img != prev_img)
      prev_img = curr_img

      puts "convert #{@img_dir}/#{curr_img} -crop '#{@segment_width}x#{@segment_height}!+#{@curr_column*@segment_width}+#{@curr_row*@segment_height}' #{@working_dir}/tile_#{@img_count.to_s.rjust(9, "0")}.png"
     `convert #{@img_dir}/#{curr_img} -crop '#{@segment_width}x#{@segment_height}!+#{@curr_column*@segment_width}+#{@curr_row*@segment_height}' #{@working_dir}/tile_#{@img_count.to_s.rjust(9, "0")}.png`
      increment_position()
      @img_count += 1
    end
  end
end

def run

  if !@img_dir
    puts "Specify the dir where the images are as an argument"
    Kernel.exit!
  end
  
  ##Create working dir
  puts "mkdir #{@working_dir}"
  `mkdir #{@working_dir}`

    slice_imgs()
  
  ##Create montage
  puts "montage -border 0 -geometry '#{@segment_width}x#{@segment_height}' -tile #{@full_img_width / @segment_width}x#{@full_img_height / @segment_height} \"#{@working_dir}/tile_*\" #{@img_dir}/final-#{DateTime.now.strftime("%Y%m%d_%H%M%S")}.png"
  `montage -border 0 -geometry '#{@segment_width}x#{@segment_height}' -tile #{@full_img_width / @segment_width}x#{@full_img_height / @segment_height} \"#{@working_dir}/tile_*\" #{@img_dir}/final-#{DateTime.now.strftime("%Y%m%d_%H%M%S")}.png`
  
  ##Delete working dir
  puts "rm -r #{@working_dir}"
  `rm -r #{@working_dir}`

end

run()