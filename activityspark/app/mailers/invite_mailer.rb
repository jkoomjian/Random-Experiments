class InviteMailer < ActionMailer::Base
  default :from => "activityspark@gmail.com"
  
  def welcome_email(recipient, body_content)
    @body_content = body_content
    mail(:to => recipient, :subject => "You have been invited to have fun with friends")
  end
end
