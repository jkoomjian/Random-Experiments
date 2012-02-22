class InvitefriendsController < ApplicationController
  def composemail
  end

  def sendinvite
    #InvitationMailer.welcome_email().deliver
	#@invite = mail(:to => "Kevin Stubbs <kevin.stubbs@live.com>")
	#@invite.deliver
  end
end
