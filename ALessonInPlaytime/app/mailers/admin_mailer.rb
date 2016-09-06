class AdminMailer < ActionMailer::Base
  default from: ALessonInPlaytime::Application.config.admin_sender

  def notify_admin(ex, user=nil, request=nil)

    user_info = user.nil? ? "No user" : "#{user.to_s}"
    url = request.nil? ? "none" : request.original_url

    body = "Error in A Lesson In Playtime!\n"\
            "#{ex.message}\n"\
            "Url: #{url}\n"\
            "User: #{user_info}\n"\
            "#{ex.backtrace.nil? ? '' : ex.backtrace.join("\n")}\n"

    mail(to: ALessonInPlaytime::Application.config.admin_emails,
          subject: "Error: #{ex.message}") do |format|
          format.text { render text: body }
    end
  end
end