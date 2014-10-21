class Criteria < ActiveRecord::Base
  
  has_many :criteria_responses
  belongs_to :user

  validates_presence_of     :user_id,                   :message=>'no user id'
  validates_presence_of     :title,                     :message=>'no title'     
  validates_inclusion_of    :weight,    :in=>0..100,    :message=>'must be between 0 and 100'

  
  # Properties: id, user, title, description, weight, active, criteria_order, created_on, updated_at, criteria_responses
     
end
