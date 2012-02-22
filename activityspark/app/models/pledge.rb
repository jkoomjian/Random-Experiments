class Pledge < ActiveRecord::Base
  has_many :participants
  has_many :notes
  
  validates :title, :num_people_required, :time, :location, presence: true
  validates :price_per_person, :num_people_required, :max_num_people, :curr_num_pledged, numericality: {greater_than_or_equal_to: 0.00}
  
  def get_host
    return self.participants[0]
  end
  
end