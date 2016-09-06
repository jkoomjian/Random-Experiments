class FeaturedLessonPortlet < Cms::Portlet

  # Mark this as 'true' to allow the portlet's template to be editable via the CMS admin UI.
  enable_template_editor false
     
  def render
    @lesson = Lesson.find(self.lesson_id)
  end
    
end