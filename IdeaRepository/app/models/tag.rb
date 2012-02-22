class Tag < ActiveRecord::Base

  belongs_to :user
  has_and_belongs_to_many :ideas
  has_and_belongs_to_many :filters
  
  # Properties: id, name, created_on, ideas, filters

  def self.find_by_name(name, current_user)
    Tag.find(:first, :conditions => ["LOWER(name) = LOWER(?) and user_id = #{current_user.id}", name])
  end

end
