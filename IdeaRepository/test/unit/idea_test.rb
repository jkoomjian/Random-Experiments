require File.dirname(__FILE__) + '/../test_helper'

class IdeaTest < Test::Unit::TestCase
  ## these must be ordered to avoid foriegn key problems
  fixtures :users, :criterias, :ideas, :criteria_responses

  def test_calculate_score
    puts "score: #{ideas(:hit_idea).calculate_score!} #{ideas(:jsf_idea).calculate_score!}"
    assert_equal 66, ideas(:hit_idea).calculate_score!
    assert_equal 70, ideas(:jsf_idea).calculate_score!
  end
end