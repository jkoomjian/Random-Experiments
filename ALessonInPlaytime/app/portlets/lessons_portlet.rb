class LessonsPortlet < Cms::Portlet

  include PortletHelpers

  # Mark this as 'true' to allow the portlet's template to be editable via the CMS admin UI.
  enable_template_editor false
     
  def render()
    @lesson = get_from_slug(params, Lesson)
    if flash[:invalid_comment].nil?
      @comment = Comment.new()
      @comment.commentable = @lesson
    else
      @comment = flash[:invalid_comment]
    end
  end
    
end