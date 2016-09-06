namespace :alip do

  desc "Set expired status on expired trial accounts"

  task :update_expired_accounts => :environment do

    # If any trial users are missing a start date, set the start date to now
    Cms::User.where("subscription_status = 'trial' and trial_start is null").update_all(:trial_start => DateTime.now())

    Cms::User.where("subscription_status = 'trial' and trial_start < ?",
                      [DateTime.now.to_date - ALessonInPlaytime::Application.config.trial_period_length])
              .update_all(:subscription_status => 'expired')

  end
end