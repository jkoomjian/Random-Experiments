class HonorRollPostsController < Cms::ApplicationController
  include CommonUtils

  def create

    if params[:honor_roll_post][:id].blank?
      # Save new
      hrp = HonorRollPost.new(params[:honor_roll_post])
      hrp.user = current_user
      success = hrp.valid? && hrp.save
      success_msg = "Your honor roll post has been " + (hrp.published ? "created" : "saved and is awaiting approval")
      success_url = "/lessons/#{hrp.lesson.slug}"
    else
      # Update existing
      hrp = verify_ownership(HonorRollPost.find(params[:honor_roll_post][:id]), current_user)
      success = hrp.update_attributes(params[:honor_roll_post])
      hrp.publish!
      success_msg = "Your honor roll post has been updated"
      success_url = "/members"
    end

    if success
      flash[:success] = success_msg
      redirect_to success_url
    else
      add_errors_to_flash(hrp.errors)
      redirect_to request.referer
    end

  end

end