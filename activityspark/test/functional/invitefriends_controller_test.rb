require 'test_helper'

class InvitefriendsControllerTest < ActionController::TestCase
  test "should get composemail" do
    get :composemail
    assert_response :success
  end

end
