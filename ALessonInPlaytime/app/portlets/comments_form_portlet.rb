class CommentsFormPortlet < Cms::Portlet
  include PortletHelpers

  # Mark this as 'true' to allow the portlet's template to be editable via the CMS admin UI.
  enable_template_editor false
     
  def render
    @comment = params[:id].blank? ? Comment.new() : verify_ownership(Comment.find(params[:id]), current_user)
  end
    
end