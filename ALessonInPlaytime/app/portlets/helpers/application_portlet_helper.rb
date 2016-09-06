module ApplicationPortletHelper
  include CommonHelpers

  def portlet_form_params(portlet, handler)
      {:url=> Cms::Engine.routes.url_helpers.portlet_handler_path(:id=>portlet.id,:handler=>handler), 
      :method=>'post'}
  end

end