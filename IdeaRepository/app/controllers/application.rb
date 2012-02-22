# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base

  include AuthenticatedSystem
  include CriteriasService

  # If you want "remember me" functionality, add this before_filter to Application Controller
  before_filter :login_from_cookie

  # Pick a unique cookie name to distinguish our session data from others'
  session :session_key => '_idea_session_id'
  
  ## Called by default when an action throws and error (p. 95)
  def rescue_action_in_public(exception)
    flash[:error] = exception
    redirect_to(:controller => 'account', :action => 'error')
  end
  
end