class HonorRollPost < ActiveRecord::Base
  acts_as_content_block
  belongs_to :user, :class_name => "Cms::User"
  belongs_to :lesson
  has_many_attachments :images, :styles => {:thumb => "190x143#", :small => "380x286#", :full => "760x506#"}
  has_many :comments, as: :commentable

  validates_presence_of :name, :user

  before_create :publish_if_no_moderation
  
  before_validation :set_slug

  def set_slug
    self.slug = self.slug.blank? ? "#{name.to_slug}-#{user.login}" : self.slug
  end

  def publish_if_no_moderation
    self.published = true unless ALessonInPlaytime::Application.config.moderate_hr_posts

    if ALessonInPlaytime::Application.config.moderate_hr_posts
      self.published = false
      send_moderate_email
    else
      self.published = true
    end
  end

  def send_moderate_email
    host = Rails.configuration.cms.site_domain
    # if domain =~ /^www/
      # host = domain.sub(/^www\./, "#{cms_domain_prefix}.")
    # else
      # host = "#{cms_domain_prefix}.#{domain}"
    # end
    email = Cms::EmailMessage.create(
        :sender => ALessonInPlaytime::Application.config.admin_sender,
        :recipients => ALessonInPlaytime::Application.config.admin_emails,
        :subject => "A new Honor Roll Post is ready to be moderated",
        :body => "Check it out: http://#{host}/cms/honor_roll_posts/#{HonorRollPost.last.nil? ? 1 : (HonorRollPost.last.id.to_i + 1)}/edit\n\nSelect the Publish or Delete buttons at the top."
    )
  end

  def send_teachers_lounge_update_email(tl_post, current_user)
    email = Cms::EmailMessage.create(
        :sender => current_user.email,
        :recipients => self.user.email,
        :subject => "#{current_user.first_name}@ALessonInPlaytime.com has responded to your honor roll post",
        :body => "#{tl_post} \n\n View the post at http://#{Rails.configuration.cms.site_domain}/honor-roll/#{self.slug}"
    )
  end

  def self.get_from_slug(slug)
    return HonorRollPost.published.where("slug = LOWER(?)", slug.downcase).first
  end

  def display_image_url(size="original")
    if self.images.length > 0
      return self.images.first.url(size)
    else
      return "http://placehold.it/150x150"
    end
  end

end
