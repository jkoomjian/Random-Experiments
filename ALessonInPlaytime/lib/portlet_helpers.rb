module PortletHelpers

  include CommonUtils

  def get_from_slug(params, cls)
    if params[:slug].blank?
      return cls.published.first(:order => "id desc")
    else
      return cls.published.where("slug = LOWER(?)", params[:slug].downcase).first
    end
  end

  def current_user=(new_user)
    session[:user_id] = new_user ? new_user.id : nil
    @current_user = new_user || false
    Cms::User.current = @current_user
  end

end