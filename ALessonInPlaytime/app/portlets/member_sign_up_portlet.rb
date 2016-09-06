class MemberSignUpPortlet < Cms::Portlet

  include PortletHelpers

  # Mark this as 'true' to allow the portlet's template to be editable via the CMS admin UI.
  enable_template_editor false
     
  def render
    @user  = Cms::User.new(flash[:user_data])
  end

  def create_new_member
    @user = Cms::User.new(params[:user])
    # give the new user member, guest roles
    ['Member', 'Guest'].each{|role|
      @user.groups << Cms::Group.find(:first, :conditions =>"name='#{role}'")
    }

    # set user's trial subscrition
    @user.trial_start = DateTime.now.to_date
    @user.subscription_status = "trial"

    if @user.save
      flash[:success] = "Welcome #{@user.first_name}"

      # Login new user
      user = Cms::User.authenticate(params[:user][:email], params[:user][:password])
      self.current_user = user

      self.success_url = "/"
      url_for_success
    else
      add_errors_to_flash(@user.errors)
      flash[:user_data] = params[:user]
      url_for_failure
    end

  end
    
end