class CriteriaResponse < ActiveRecord::Base

  belongs_to :idea
  belongs_to :criteria

  #why is message not appearing properly?
  validates_inclusion_of    :score, :allow_nil => true, :allow_blank => true, :in=>0..10, :message=> 'must be between 0 and 10'

  # Properties: id, idea, criteria, score, response, created_on, updated_at

#  def initialize(criteria, idea)
#    super()
#    self.criteria = criteria
#    self.idea = idea
#  end

end
