require 'erb'

# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper

  include ERB::Util

  def rel_time(time)
    sec_in_min = 60
    sec_in_hr = sec_in_min * 60
    sec_in_day = sec_in_hr * 24
    sec_in_week = sec_in_day * 7
    sec_in_month = sec_in_week * 4 #ok to be approximate here
    sec_in_year = sec_in_day * 365
  
    now = Time.now()
    diff = (now - time).abs()  # difference in seconds

    # if longer than 6 months ago just display the date
    if diff > (sec_in_month * 6) then return "#{time.month}/#{time.day}/#{time.year}"; end
  
    is_future = (now <=> time) < 0  # <=> = compareTo in java
    str_time = case
                when diff < sec_in_min:   units = diff.round(); "#{units} second#{plural(units)}"
                when diff < sec_in_hr:    units = (diff/sec_in_min).round(); "#{units} minute#{plural(units)}"
                when diff < sec_in_day:   units = (diff/sec_in_hr).round(); "#{units} hour#{plural(units)}"
                when diff < sec_in_week
                  units = (diff/sec_in_day).round();
                  if units == 1
                    return is_future ? "tomorrow" : "yesterday"
                  end
                  "#{units} day#{plural(units)}"
                when diff < sec_in_month: units = (diff/sec_in_week).round(); "#{units} week#{plural(units)}"
                when diff < sec_in_year:  units = (diff/sec_in_month).round(); "#{units} month#{plural(units)}"
                else   units = (diff/sec_in_year).round(); "#{units} year#{plural(units)}"
               end
    
    if is_future
      return "in #{str_time}" #future
    else
      return "#{str_time} ago" #past
    end
  end
  
  def text_to_html(value)
    bctxt = BlueCloth::new(html_escape(value)).to_html()
    # markdown likes to add lots of <p> tags instead of using <br>
    bctxt.gsub!("<p>", "");
    bctxt.gsub!("</p>", "<br/>")
    #remove trailing <br/>'s'
    bctxt.chomp("<br/>")
  end
  
  private
  
  def plural(unit)
    return unit == 1 ? "" : "s"
  end

end