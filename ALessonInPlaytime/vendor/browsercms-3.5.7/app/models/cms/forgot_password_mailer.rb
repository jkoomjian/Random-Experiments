module Cms
  class ForgotPasswordMailer < ActionMailer::Base

    def reset_password(link, email)
      @url = link
      @sent_on = Time.now
      mail(
        :subject => "Account Management",
        :to => email,
        :from => 'do_not_reply@domain.com',
        :template_path => "cms/forgot_password_mailer",
        :template_name => "reset_password"
        )
    end

  end
end