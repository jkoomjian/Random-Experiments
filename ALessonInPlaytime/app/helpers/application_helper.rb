module ApplicationHelper

  include CommonHelpers

  def render_block(block_name)
    hbs = Cms::HtmlBlock.where(:name=>block_name)
    if hbs.length > 0
      render_connectable hbs.first 
    end
  end

  def page_id()
    path = current_page.path
    path.slice!(0)
    path.sub!("/", "-")
    path.downcase!
    if path.empty? then return "homepage" end
    return path
  end

  def should_show_signup_from
    login = cookies[:login]

    if !login.blank?
      user = Cms::User.where("login = ?", [login]).first
      if !user.nil? and user.subscription_status == "expired"
        return false
      end
    end

    return true
  end

  def ensure_trial_expiration_warning_displayed
    if current_user.subscription_status == "expired"
      flash[:warning] = "Your trial account has expired!"
    end
  end

  def random_color
    colors = [:pink, :blue, :green, :yellow, :orange, :orange, :green, :blue, :yellow]
    colors[ rand(colors.length) ]
  end

end