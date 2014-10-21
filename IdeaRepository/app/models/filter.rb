class Filter < ActiveRecord::Base

  has_and_belongs_to_many :tags
  
  # Properties: id, name, tags

end
