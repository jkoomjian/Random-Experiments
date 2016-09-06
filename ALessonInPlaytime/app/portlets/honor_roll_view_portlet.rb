class HonorRollViewPortlet < Cms::Portlet

  include PortletHelpers

  # Mark this as 'true' to allow the portlet's template to be editable via the CMS admin UI.
  enable_template_editor false

  def render
    @hrp = get_from_slug(params, HonorRollPost)
    if flash[:invalid_comment].nil?
      @comment = Comment.new()
      @comment.commentable = @hrp
    else
      @comment = flash[:invalid_comment]
    end  
    @block = @hrp
  end

end