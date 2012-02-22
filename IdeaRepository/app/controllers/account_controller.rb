class AccountController < ApplicationController

  def index
    if logged_in?
      redirect_to(:controller => '/ideas', :action => 'list') 
    else
      redirect_to(:action => 'login')
    end
  end

  def login
    return unless request.post?
    ## self.current_user= is actually method call- sets user in session
    self.current_user = User.authenticate(params[:email], params[:password])
    ## current_user is a call to current_user in ActionController
    if current_user
      if params[:remember_me] == "1"
        self.current_user.remember_me
        cookies[:auth_token] = { :value => self.current_user.remember_token , :expires => self.current_user.remember_token_expires_at }
      end
      ## redirect to referrer if availible, else /ideas/list
      redirect_back_or_default(:controller => '/account', :action => 'index')
    else
      flash[:error] = "Incorrect username or password"
    end
  end

  def signup
    @user = User.new(params[:user])
    return unless request.post?
    @user.save!  #get the user_id
    @user.criterias = default_criterias(@user.id)
    @user.save!
    self.current_user = @user
    flash[:notice] = "Thanks for signing up!"
    redirect_back_or_default(:controller => '/account', :action => 'index')
  rescue ActiveRecord::RecordInvalid
    render :action => 'signup'
  end
  
  def logout
    self.current_user.forget_me if logged_in?
    cookies.delete :auth_token
    reset_session
    flash[:notice] = "You have been logged out."
    redirect_to(:controller => '/account', :action => 'login')
  end
  
  #copied from http://technoweenie.stikipad.com/plugins/show/Change+Password
  def change_password
    return unless request.post?
    if User.authenticate(current_user.email, params[:old_password])
      if (params[:password] == params[:password_confirmation])
        current_user.password = params[:password]
        current_user.encrypt_password
        flash[:notice] = current_user.save ? "Password changed" : "Error changing password"
        redirect_to(:controller => '/ideas', :action => 'list')
      else
        flash[:error] = "Password mismatch" 
      end
    else
      flash[:error] = "Wrong password" 
    end
  end
  
end