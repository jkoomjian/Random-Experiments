class Badge < ActiveRecord::Base
  acts_as_content_block
  has_attachment :image, :styles => {:small => "120x120#", :full => "360x360#"}
end
