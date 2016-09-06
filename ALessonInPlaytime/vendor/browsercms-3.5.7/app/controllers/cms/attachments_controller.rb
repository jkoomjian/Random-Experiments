module Cms
  class AttachmentsController < Cms::BaseController

    skip_before_filter :redirect_to_cms_site, :only => [:download]
    # currently requires a login to upload images
    skip_before_filter :login_required, :only => [:download]
    skip_before_filter :cms_access_required, :only => [:download, :create, :destroy, :show]
    skip_before_filter :verify_authenticity_token, :only => [:create, :destroy]


    include ContentRenderingSupport
    include Cms::Attachments::Serving

    # Returns a specific version of an attachment.
    # Used to display older versions in the editor interface.
    def show
      @attachment = Attachment.unscoped.find(params[:id])
      @attachment = @attachment.as_of_version(params[:version]) if params[:version]
      send_attachment(@attachment)
    end

    # This handles serving files for attachments that don't have a user specified path. If a path is defined,
    # the ContentController#try_to_stream will handle it.
    #
    # Users can only download files if they have permission to view it.
    def download
      @attachment = Attachment.find(params[:id])
      send_attachment(@attachment)
    end

    def create
      @attachment = Attachment.new(params[:attachment])
      @attachment.published = true
      @attachment.created_by = current_user
      if @attachment.save
        render :partial => 'cms/attachments/attachment_wrapper', :locals => {:attachment => @attachment}
      else
        #TODO: render html error string
        render :inline => 'an error ocurred'
      end
    end

    def destroy
      @attachment = Attachment.find(params[:id])
      if current_user.is_admin? || current_user == @attachment.created_by
        @attachment.destroy
      end
      render :json => @attachment.id
    end

    private

  end
end