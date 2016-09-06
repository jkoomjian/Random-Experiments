# CommonUtils is included in all Controller and Portlet code
module CommonUtils

  def add_errors_to_flash(errors)
    middle = errors.count > 1 ? "these #{errors.count} errors" : "this error"
    msg = "Please correct #{middle}:<br/><ul>"
    errors.full_messages.each{|value|
      msg += "<li>#{value}</li>"
    }
    msg += "</ul>"
    flash[:error] = msg
  end

  # returns obj if this can be edited by current_user, else throws exception
  def verify_ownership(obj, current_user)
    if obj.user == current_user || obj.user.is_admin?
      return obj
    else
      raise Cms::Errors::AccessDenied
    end
  end

end