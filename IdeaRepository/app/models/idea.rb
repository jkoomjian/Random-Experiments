class Idea < ActiveRecord::Base

  belongs_to :user ## map one to many relationship
  has_and_belongs_to_many :tags ## map many-to-many relationship- notice *s means collection
  has_many :criteria_responses
  
  attr_reader :initial_score

  # methods added by has_many:
  # criteria_responses() return an array of this objects autoreads
  # criteria_responses << autoread add and autoread to this user
  # criteria_responses.push() add one or more autoread objects
  # criteria_responses.delete()
  # criteria_responses.clear() break the association, deleting the autoreads if dependent is true
  # criteria_responses.find() 
  # criteria_responses.create() build, link and save a new autoread object
  # 
  # Added by belongs_to
  # user get the user
  # user= set the user
  # build_user construct a new user
  # create_user construct a new user, link to it, and save it

  validates_presence_of :title,:user
  validates_inclusion_of :initial_score, :allow_nil => true, :allow_blank => true, :in=>0..100, :message=> 'must be between 0 and 100'

  before_save :calculate_score!

  # Properties: id, user, title, score, summary, additional_thoughts, created_at, updated_at, tags, criteria_responses

  #-------------------------------- Logic ------------------------------------#
  
  def calculate_score!
    highest_possible_score = 0
    actual_score = 0
    self.criteria_responses.each{|cr|
      if cr.score
        highest_possible_score += 10 * cr.criteria.weight
        actual_score += cr.score * cr.criteria.weight
      end
    }
    self.score = (highest_possible_score == 0) ? 0 : (actual_score * 100) / highest_possible_score
    
    ## check for initial_score
    if self.score == 0 && self.initial_score.to_i > 0
      self.score = self.initial_score.to_i
    end
  end

  #-------------------------------- Attr Writer ------------------------------------#
  # is there a better way to do this?
  def initial_score=(is)
    @initial_score = is.to_i
  end
end