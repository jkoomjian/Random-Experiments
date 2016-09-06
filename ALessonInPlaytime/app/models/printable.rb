class Printable < ActiveRecord::Base
  acts_as_content_block
  has_attachment :attachment
  belongs_to :lessons
end
