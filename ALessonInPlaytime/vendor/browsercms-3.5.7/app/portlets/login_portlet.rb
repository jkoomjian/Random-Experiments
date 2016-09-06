class LoginPortlet < Cms::Portlet

  enable_template_editor false
  
  def render
    @success_url = (flash[:success_url] || self.success_url)
    @failure_url = self.failure_url
    @login = flash[:login] || params[:login] || cookies[:login]
    @remember_me = flash[:remember_me] || params[:remember_me] || true
    @hide_signup_form = should_hide_signup_from_expired_user(@login)
  end

end