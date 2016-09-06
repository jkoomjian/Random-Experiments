require File.join(File.dirname(__FILE__), '/../../test_helper')

class LessonsTest < ActiveSupport::TestCase

  test "Should be able to create new instance of a portlet" do
    assert LessonsPortlet.create!(:name => "New Portlet")
  end
  
end