class HonorRollFormPortlet < Cms::Portlet
  include PortletHelpers

  # Mark this as 'true' to allow the portlet's template to be editable via the CMS admin UI.
  enable_template_editor false
     
  def render
    ## move this code?

    if !params[:hrp_slug].blank?
      # Update existing hrp
      @honor_roll_post = verify_ownership(get_from_slug({:slug => params[:hrp_slug]}, HonorRollPost), current_user)
    else
      # new hrp
      @honor_roll_post = HonorRollPost.new()
    end


    @honor_roll_post.lesson = get_from_slug({:slug => params[:lesson_slug]}, Lesson)
    # @honor_roll_post.lesson = Lesson.published.where("slug = LOWER(?)", params[:lesson_slug].downcase).first

    ## This overcomes a bug in bcms :(
    @block = @honor_roll_post
  end

end