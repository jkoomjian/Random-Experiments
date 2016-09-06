class RecentHonorRollPostsPortlet < Cms::Portlet

  # Mark this as 'true' to allow the portlet's template to be editable via the CMS admin UI.
  enable_template_editor false
     
  def render
    @honor_roll_posts = HonorRollPost.find(:all, :conditions => "published=true", :order => "created_at desc", :limit => self.num_honor_roll_posts_to_display)
  end
    
end