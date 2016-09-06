class CommentsController < Cms::ApplicationController
  include CommonUtils

  def update
    @comment = verify_ownership(Comment.find(params[:comment][:id]), current_user)
    if @comment.update_attributes(params[:comment])
      @comment.publish! #automatically publish updates
      flash[:success] = "Comment updated"
      redirect_to "/members"
    else
      add_errors_to_flash(@comment.errors)
      redirect_to request.referer
    end
  end

  def create
    @comment = Comment.new(params[:comment])
    if logged_in?
      @comment.user = current_user
    end
    @comment.ip = request.remote_ip
    if @comment.valid? && is_valid?(params, @comment) && @comment.save
      flash[:success] = "Comment created" + (@comment.published ? "" : " and is awaiting approval")
      @comment.send_moderate_email
    else
      add_errors_to_flash(@comment.errors)
      flash[:invalid_comment] = @comment
    end
    redirect_to request.referer
  end


  private

  def is_valid?(params, comment)
    return has_author?(comment) && is_human?(params, comment)
  end

  def has_author?(comment)
    if logged_in? || !comment.author.blank?
      return true
    else
      comment.errors.add(:author, "can't be blank")
      return false
    end
  end

  # A simple check to block bots - signup_check should never be filled in
  def is_human?(params, comment)
    if !logged_in?
      if params[:signup_check].nil? || params[:signup_check].length > 0
        comment.errors.add(:base, "Are you really human??")
        return false
      end
    end
    return true
  end

end