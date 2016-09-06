require "stripe"

class PaymentsController < Cms::ApplicationController
  include CommonUtils

  def subscribe
    token = params[:stripeToken]
    subType = params[:subscriptionType]

    # Create a Customer
    # Currently creating a new Stripe customer for each new plan
    # If a user cancels a plan and then resubscribes, they will get a new Stripe cust
    # (the email will be the same)
    customer = Stripe::Customer.create(
      :card => token,
      :plan => subType,
      :email => current_user.email
    )

    # Save the customer stripe id to the DB
    current_user.stripe_id = customer.id

    # Update the user's payment status
    current_user.subscription_status = "paid"
    current_user.save!

    redirect_to "/members/thankyou"
  end

  def cancel
    cust = Stripe::Customer.retrieve(current_user.stripe_id)
    ## TODO verify error handling on this
    sub = cust.subscriptions.data[0]

    begin
      sub.delete()
    ensure
      current_user.subscription_status = "expired"
      current_user.save()
    end

    flash[:success] = "You are now unsubscribed"
    redirect_to "/members"
  end

end