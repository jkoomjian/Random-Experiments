require "stripe"

class PaymentPortlet < Cms::Portlet

  # Mark this as 'true' to allow the portlet's template to be editable via the CMS admin UI.
  enable_template_editor false
     
  def render
    # Does this user have a current subscription?
    @has_subscription = !current_user.stripe_id.blank? && current_user.subscription_status == "paid"
    
    # If so, display the sub. data
    if @has_subscription
      cust = Stripe::Customer.retrieve(current_user.stripe_id)
      subs = cust.subscriptions
      
      # if there is not 1 sub, something is very wrong
      if subs.data.length != 1
        raise "#{current_user.to_s} has #{subs.data.length} subscriptions, but should have 1"
      end

      sub = subs.data[0]
      sub_start = Time.at(sub.start)
      case sub.plan[:interval]
        when "month"
          interval_date = "the #{sub_start.day.ordinalize}"
        when "year"
          interval_date = sub_start.strftime("%b %-d")
      end

      @sub_desc = "#{sub.plan[:name].capitalize} plan: "\
                  "$#{sub.plan[:amount] / 100}/#{sub.plan[:interval]} "\
                  "renewing on #{interval_date} of each #{sub.plan[:interval]}"

    elsif current_user.subscription_status == "trial"
      unless current_user.trial_start.blank?
        exp_date = current_user.trial_start + ALessonInPlaytime::Application.config.trial_period_length
        days_remaning = (exp_date.to_date - DateTime.now.to_date).to_i
        @sub_desc = "Your trial subscription will expire in #{days_remaning} days."
      end
    end
    
  end
    
end