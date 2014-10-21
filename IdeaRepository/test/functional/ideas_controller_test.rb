require File.dirname(__FILE__) + '/../test_helper'
require 'ideas_controller'

# Re-raise errors caught by the controller.
class IdeasController; def rescue_action(e) raise e end; end

class IdeasControllerTest < Test::Unit::TestCase
  fixtures :ideas

  def setup
    @controller = IdeasController.new
    @request    = ActionController::TestRequest.new
    @response   = ActionController::TestResponse.new

    @first_id = ideas(:first).id
  end

  def test_index
    get :index
    assert_response :success
    assert_template 'list'
  end

  def test_list
    get :list

    assert_response :success
    assert_template 'list'

    assert_not_nil assigns(:ideas)
  end

  def test_show
    get :show, :id => @first_id

    assert_response :success
    assert_template 'show'

    assert_not_nil assigns(:idea)
    assert assigns(:idea).valid?
  end

  def test_new
    get :new

    assert_response :success
    assert_template 'new'

    assert_not_nil assigns(:idea)
  end

  def test_create
    num_ideas = Idea.count

    post :create, :idea => {}

    assert_response :redirect
    assert_redirected_to :action => 'list'

    assert_equal num_ideas + 1, Idea.count
  end

  def test_edit
    get :edit, :id => @first_id

    assert_response :success
    assert_template 'edit'

    assert_not_nil assigns(:idea)
    assert assigns(:idea).valid?
  end

  def test_update
    post :update, :id => @first_id
    assert_response :redirect
    assert_redirected_to :action => 'show', :id => @first_id
  end

  def test_destroy
    assert_nothing_raised {
      Idea.find(@first_id)
    }

    post :destroy, :id => @first_id
    assert_response :redirect
    assert_redirected_to :action => 'list'

    assert_raise(ActiveRecord::RecordNotFound) {
      Idea.find(@first_id)
    }
  end
end
