class Cms::HonorRollPostsController < Cms::ContentBlockController

  def update
    load_block

    tl = params[:honor_roll_post][:teachers_lounge]
    if !params[:email_tl].blank? and !tl.blank?
      @block.send_teachers_lounge_update_email(tl, current_user)
    end

    self.class.superclass.instance_method(:update).bind(self).call
  end

end