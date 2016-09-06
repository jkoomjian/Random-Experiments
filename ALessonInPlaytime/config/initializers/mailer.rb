ActionMailer::Base.delivery_method = :smtp
 
ActionMailer::Base.smtp_settings = {
:enable_starttls_auto => true,
:address => 'smtp.gmail.com',
:port => 587,
:domain => 'alessoninplaytime.com',
:user_name => ALessonInPlaytime::Application.config.admin_sender,
:password => ALessonInPlaytime::Application.config.admin_pass,
:authentication => 'plain'
}