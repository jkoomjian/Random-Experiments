require File.dirname(__FILE__) + '/../test_helper'
require 'criteria_controller'

# Re-raise errors caught by the controller.
class CriteriaController; def rescue_action(e) raise e end; end

class CriteriaControllerTest < Test::Unit::TestCase
  fixtures :criterias

  def setup
    @controller = CriteriaController.new
    @request    = ActionController::TestRequest.new
    @response   = ActionController::TestResponse.new

    @first_id = criterias(:first).id
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

    assert_not_nil assigns(:criterias)
  end

  def test_show
    get :show, :id => @first_id

    assert_response :success
    assert_template 'show'

    assert_not_nil assigns(:criteria)
    assert assigns(:criteria).valid?
  end

  def test_new
    get :new

    assert_response :success
    assert_template 'new'

    assert_not_nil assigns(:criteria)
  end

  def test_create
    num_criterias = Criteria.count

    post :create, :criteria => {}

    assert_response :redirect
    assert_redirected_to :action => 'list'

    assert_equal num_criterias + 1, Criteria.count
  end

  def test_edit
    get :edit, :id => @first_id

    assert_response :success
    assert_template 'edit'

    assert_not_nil assigns(:criteria)
    assert assigns(:criteria).valid?
  end

  def test_update
    post :update, :id => @first_id
    assert_response :redirect
    assert_redirected_to :action => 'show', :id => @first_id
  end

  def test_destroy
    assert_nothing_raised {
      Criteria.find(@first_id)
    }

    post :destroy, :id => @first_id
    assert_response :redirect
    assert_redirected_to :action => 'list'

    assert_raise(ActiveRecord::RecordNotFound) {
      Criteria.find(@first_id)
    }
  end
end
