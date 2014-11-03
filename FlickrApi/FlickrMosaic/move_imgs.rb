@dir = ""
@total_file_count = 174592
@dirs_to_create = 11

@work_dir = @dir + "/working"
@img_count = 0
@curr_dir_no = 0


puts "mkdir #{@dir}/working_0"
`mkdir #{@dir}/working_0`

while (@img_count<@total_file_count)
  
  if (@img_count > 1 && (@img_count % (@total_file_count / @dirs_to_create)) == 0 ) 
      @curr_dir_no += 1
      puts "mkdir #{@dir}/working_#{@curr_dir_no}"
      `mkdir #{@dir}/working_#{@curr_dir_no}`
  end
  
  filename = "tile_#{@img_count.to_s.rjust(9, "0")}.png"
  puts "mv #{@work_dir}/#{filename} #{@dir}/working_#{@curr_dir_no}"
  `mv #{@work_dir}/#{filename} #{@dir}/working_#{@curr_dir_no}`
  
  @img_count += 1
end

##generate the montage images
count = 0
while (count < @dirs_to_create)
  puts "montage -border 0 -geometry '2x2' -tile 512x31 '#{@dir}/working_#{count}/tile_*' #{@dir}/montages/montage_#{count.to_s.rjust(3, "0")}.png"
  `montage -border 0 -geometry '2x2' -tile 512x31 '#{@dir}/working_#{count}/tile_*' #{@dir}/montages/montage_#{count.to_s.rjust(3, "0")}.png`
  count += 1
end

##generate the final image!
puts "montage -border 0 -geometry '1024x62' -tile 1x11 '#{@dir}/montages/montage_*' #{@dir}/final-big-one.png"
`montage -border 0 -geometry '1024x62' -tile 1x11 '#{@dir}/montages/montage_*' #{@dir}/final-big-one.png`
