include Cms::Authentication::Controller

class ResetPasswordPortlet < Cms::Portlet

  def render
    flash[:reset_password] = {}
    

    # Users can get to this page 2 ways
    # * forgot password - auth user by forgot pass token
    # * logged in user changes pass
    if request.post?
    
      if logged_in?
        @user = current_user
      else
        # unless params[:token]
        #   flash[:reset_password][:error] = "No password token given"
        #   return
        # end
        @user = params[:token] ? Cms::User.find_by_reset_token(params[:token]) : nil
        unless @user
          flash[:reset_password][:notice] = "Invalid password token"    
          return
        end
      end

      @user.password = params[:password]
      @user.password_confirmation = params[:password_confirmation]

      if @user.save
        flash[:reset_password][:notice] = 'Password has been reset'
      end
    end
  end

end
