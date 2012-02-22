require 'digest/sha1'
class User < ActiveRecord::Base
 
  #ActiveRecord relationships
  has_many :ideas
  has_many :criterias
  has_many :tags

  # Virtual attribute for the unencrypted password
  attr_accessor :password

  # Validation
  validates_presence_of     :email
  validates_format_of       :email, :with => %r{^.+@.+\.(com|org|net|edu)$}i, :message => "Must be a valid email address"
  validates_uniqueness_of   :email
  # only validate password on signup, login (create command)
  validates_presence_of     :password, :on => :create,                     :if => :password_required?
  validates_presence_of     :password_confirmation, :on => :create,        :if => :password_required?
  validates_length_of       :password, :within => 3..40, :on => :create,   :if => :password_required?
  validates_confirmation_of :password, :on => :create,                     :if => :password_required?

  before_create :encrypt_password

  # Properties: id, email, crypted_password, salt, created_at, updated_at, remember_token, remember_token_expires_at, ideas, criterias, tags

  #-------------------------------- Logic ------------------------------------#
  
  #putting self in the method definition makes this a class method (aka static)
  def self.find_by_email(curr_email)
    find(:first, :conditions => "email = \'#{curr_email}\'")
  end
  
  def self.find_by_email!(curr_email)
    user = find_by_email(curr_email)
    if user.nil?: raise "No user with given email found" end
    return user
  end

  #-------------------- Authentication Methods ------------------------------------#

  # Authenticates a user by their login name and unencrypted password.  Returns the user or nil.
  def self.authenticate(login, password)
    u = find_by_email(login) # need to get the salt
    (u && u.authenticated?(password)) ? u : nil
  end

  # Encrypts some data with the salt.
  def self.encrypt(password, salt)
    Digest::SHA1.hexdigest("--#{salt}--#{password}--")
  end

  # Encrypts the password with the user salt
  def encrypt(password)
    self.class.encrypt(password, salt)
  end

  def authenticated?(password)
    crypted_password == encrypt(password)
  end

  def remember_token?
    remember_token_expires_at && Time.now.utc < remember_token_expires_at 
  end

  # These create and unset the fields required for remembering users between browser closes
  def remember_me
    self.remember_token_expires_at = 2.weeks.from_now.utc
    self.remember_token            = encrypt("#{email}--#{remember_token_expires_at}")
    save(false)
  end

  def forget_me
    self.remember_token_expires_at = nil
    self.remember_token            = nil
    save(false)
  end

  # before filter 
  def encrypt_password
    self.salt = Digest::SHA1.hexdigest("--#{Time.now.to_s}--#{email}--") if new_record?
    self.crypted_password = encrypt(password)
  end
    
  def password_required?
    !password.blank? || !crypted_password.blank?
  end
end