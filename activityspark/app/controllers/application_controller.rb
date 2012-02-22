class ApplicationController < ActionController::Base
  # require InviteMailer

  protect_from_forgery

def send_invites(pledge, body_content)
  pledge.participants.each{|p|
    if p.id != pledge.get_host.id  

      body_content = body_content.gsub("user_id", p.id.to_s)
      body_content = body_content.gsub("pledge_id", pledge.id.to_s)

	  InviteMailer.welcome_email(p.email_addr, body_content).deliver
    end
  }
end

def send_matched(pledge)
  ApproveMailer.approve_email(pledge.get_host.email_addr, pledge).deliver
end


end
