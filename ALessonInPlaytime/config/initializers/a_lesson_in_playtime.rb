ALessonInPlaytime::Application.config.moderate_hr_posts = true

# Length of trial period in days
ALessonInPlaytime::Application.config.trial_period_length = 31

cfg = Rails.configuration.database_configuration['env']
ALessonInPlaytime::Application.config.admin_emails = "admin@alessoninplaytime.com"
ALessonInPlaytime::Application.config.admin_sender = "admin@alessoninplaytime.com"
ALessonInPlaytime::Application.config.admin_pass = cfg['ALIP_MAIL_SENDER_PASS']

ALessonInPlaytime::Application.config.s3_access_key_id = cfg['S3_ACCESS_KEY_ID']
ALessonInPlaytime::Application.config.s3_secret_access_key = cfg['S3_SECRET_ACCESS_KEY']
ALessonInPlaytime::Application.config.s3_bucket = cfg['S3_BUCKET_NAME']


# Stripe
Rails.configuration.stripe = {
  :publishable_key => cfg['STRIPE_PUBLISHABLE_KEY'],
  :secret_key      => cfg['STRIPE_SECRET_KEY']
}

Stripe.api_key = Rails.configuration.stripe[:secret_key]