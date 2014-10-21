require 'test_helper'

class TestmeControllerTest < ActionController::TestCase
  test "should get test" do
    get :test
    assert_response :success
  end

end
