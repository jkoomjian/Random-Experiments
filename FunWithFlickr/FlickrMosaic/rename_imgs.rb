@dir = ARGV[0]

Dir.foreach(@dir) {|f|
  if (f =~ /\.jpg/)  
    rand = Kernel.rand(1000)
    File.rename(@dir + "/" + f, @dir + "/" + rand.to_s + ".jpg")
  end
}
