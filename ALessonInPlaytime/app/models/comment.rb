class Comment < ActiveRecord::Base
  acts_as_content_block

  #commentable is the parent object of this comment - my be Lesson or HonorRollPost
  belongs_to :commentable, polymorphic: true
  belongs_to :user, :class_name => "Cms::User"

  validates_presence_of :commentable_id, :commentable_type, :body
  # validate :is_human?, :has_author?

  before_create :publish_if_no_moderation
  # prepend: true is a nasty hack around a bug in BCMS
  # bcms creates the versioned object in a before_save call - if that 
  # before save call is called before this one, this call's changes will
  # be applied after the versioned object is cloned. the version object, which 
  # is the one saved to db, will never see the changes to the true object
  before_save :set_name, :verify_url, prepend: true


  def commentable_url
    url_paths = {"Lesson" => "/lessons/", "HonorRollPost" => "/honor-roll/"}

    if self.commentable && url_paths[self.commentable_type]
      return url_paths[self.commentable_type] + self.commentable.slug
    end
  end

  def send_moderate_email
    email = Cms::EmailMessage.create(
        :sender => ALessonInPlaytime::Application.config.admin_sender,
        :recipients => ALessonInPlaytime::Application.config.admin_emails,
        :subject => "A new Comment is ready to be moderated",
        :body => "Check it out: "\
                  "http://#{Rails.configuration.cms.site_domain}/cms/comments/#{self.id.to_i}/edit"\
                  "\n\nSelect the Publish or Delete buttons at the top."
    )
  end

  protected

  def publish_if_no_moderation
    self.published = true unless ALessonInPlaytime::Application.config.moderate_hr_posts
  end

  # the name is just the first 30 chars of comment body
  def set_name
    self.name = self.body.slice(0, 30)
  end

  #require absolute urls
  def verify_url
    if !self.url.blank? && (self.url =~ /^http/).nil?
      self.url = "http://#{self.url}"
    end
  end

  # def is_human?
  #   puts "\n\n\nat validate"
  #   puts "is new: #{self.new_record?} current_user: #{defined? current_user} params: #{defined? params}"
  #   puts "\n\n\n"
  #   errors.add(:body, "at validate")
  # end

  #TODO should this be here or in the controller
  # A simple check to block bots - signup_check should never be filled in
  def is_human?
    # debugger
    puts "\n\n\nparams #{defined? params} params[:signup_check] #{params[:signup_check]}"
    # puts "\n\n\nlogged in: #{logged_in?} params #{defined? params}"
    # if !logged_in?
    #   if params[:signup_check].nil? || params[:signup_check].length > 0
    #     comment.errors.add(:base, "Are you really human??")
    #   end
    # end
  end

  def has_author?
    # puts "\n\n\nlogged in: #{logged_in?} self.author: #{self.author}"
    # if !logged_in? && self.author.blank?
    #   comment.errors.add(:author, "can't be blank")
    # end
  end

end