class MyCommentsPortlet < Cms::Portlet

  # Mark this as 'true' to allow the portlet's template to be editable via the CMS admin UI.
  enable_template_editor false
     
  def render
    @my_comments = Comment.published.where("user_id = ?", [current_user.id]).order("id desc")
  end
    
end