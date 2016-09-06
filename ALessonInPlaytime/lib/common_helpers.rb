# Included in all controller and portlet helpers, included in the view
module CommonHelpers

  ## Does the current user have access to the post they are trying to access,
  ## or should we display the membership popup
  def has_access(post, current_user)
    return (post.is_free || 
            current_user.is_admin? || 
            (current_user.in_group?("Member") &&
              ["paid", "trial", "free"].include?(current_user.subscription_status)))
  end

  def has_account_expired(current_user)
    return current_user.subscription_status == "expired"
  end

  def display_date(dt)
    dt.strftime("%B %e, %Y")
  end

end