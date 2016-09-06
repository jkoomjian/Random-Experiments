class HomepagePromoPortlet < Cms::Portlet

  # Mark this as 'true' to allow the portlet's template to be editable via the CMS admin UI.
  enable_template_editor false
     
  def render
    @featured_lessons = (1..3).map {|x| Lesson.find(@portlet.send("featured_lesson_#{x}"))} 
  end
    
end