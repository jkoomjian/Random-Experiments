class Lesson < ActiveRecord::Base
  require 'set'

  acts_as_content_block :taggable => true
  belongs_to_category
  has_attachment :image, :styles => {:thumb => "190x143#", :small => "380x286#", :full => "760x760#", :poster => "760x330#"}
  has_many :printables
  has_many :honor_roll_posts
  has_many :comments, as: :commentable

  before_validation :set_slug

  def set_slug
    counter = 2
    slug = curr_slug = self.slug.empty? ? self.name.to_slug : self.slug

    while (slug_is_not_unique?(curr_slug))
      curr_slug = "#{slug}-#{counter}"
      counter += 1
    end

    self.slug = curr_slug
  end

  def get_from_slug(slug)
    return Lesson.published.where("slug = LOWER(?)", slug.downcase).first
  end

  def display_image_url(size="original")
    return self.image ? self.image.url(size) : "http://placehold.it/150x150"
  end

  def self.all_lesson_topics
    topics = Set.new
    Lesson.published.all.each{|lesson|
      lesson.lesson_focus.split(",").each{|curr_topic|
        curr_topic = curr_topic.strip.capitalize
        if !curr_topic.blank? then topics.add(curr_topic) end
      }
    }
    return topics.to_a
  end

  private

    def slug_is_not_unique?(slug)
      query = "slug = LOWER(?)"
      if !self.id.blank? then query = "id <> #{self.id} and " + query end
      return Lesson.where(query, slug.downcase).length > 0
    end

end