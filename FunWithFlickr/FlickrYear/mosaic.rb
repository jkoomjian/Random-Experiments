require 'date'

#ruby mosaic.rb <imgs_dir> <dest_dir>
@imgs_dir = ARGV[0]
@dest_dir = ARGV[1]
@tile_width = 150
@tile_height = 150
# @tiles_across = @tiles_high = 19
@tiles_across = 30
@tiles_high = 12

@cmd = "montage -border 0" +
        " -geometry '#{@tile_width}x#{@tile_height}'" +
        " -tile #{@tiles_across}x#{@tiles_high}" +
        " #{@imgs_dir}/*.jpg" + 
        " #{@dest_dir}/final-#{DateTime.now.strftime("%Y%m%d_%H%M%S")}.png"
puts @cmd
`#{@cmd}`
