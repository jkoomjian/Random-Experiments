class ApproveMailer < ActionMailer::Base
  default :from => "activityspark@gmail.com"
  
  def approve_email(recipient, pledge)
    @pledge = pledge
    mail(:to => recipient, :subject => "Your Activity Is On!")
  end
end
