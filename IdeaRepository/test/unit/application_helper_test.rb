require File.dirname(__FILE__) + '/../test_helper'

class ApplicationHelperTest < Test::Unit::TestCase
  
  include ApplicationHelper
  
  def test_rel_time
    now = Time.now()
    fourty_sec_ago = now - 40
    one_min_ago = now - 60
    one_half_min_ago = now - 90
    half_hour_ago = now - (60 * 30)
    one_half_hour_ago = now - (60 * 90)
    one_day_ago = now - (60 * 60 * 24)
    two_day_ago = now - (60 * 60 * 48)
    two_week_ago = now - (60 * 60 * 24 * 14)
    two_month_ago = now - (60 * 60 * 24 * 7 * 8)
    two_year_ago = now - (60 * 60 * 24 * 365 * 2)
    two_hours_from_now = now + (60 * 60 *2)
    
    assert_equal(rel_time(now), "0 seconds ago")
    assert_equal(rel_time(fourty_sec_ago), "40 seconds ago")
    assert_equal(rel_time(one_min_ago), "1 minute ago")
    assert_equal(rel_time(one_half_min_ago), "2 minutes ago")
    assert_equal(rel_time(half_hour_ago), "30 minutes ago")
    assert_equal(rel_time(one_half_hour_ago), "2 hours ago")
    assert_equal(rel_time(one_day_ago), "yesterday")
    assert_equal(rel_time(two_day_ago), "2 days ago")
    assert_equal(rel_time(two_week_ago), "2 weeks ago")
    assert_equal(rel_time(two_month_ago), "2 months ago")
    assert_equal(rel_time(two_year_ago), "2 years ago")
    assert_equal(rel_time(two_hours_from_now), "in 2 hours")
  end
  
  def test_text_to_html
    assert_equal(text_to_html(""), "")
    assert_equal(text_to_html("asdf\nasfd"), "asdf<br />asfd")
    assert_equal(text_to_html("\nasdf\n\n\n\n\asdfas\ndf\n"), "<br />asdf<br /><br /><br /><br />\asdfas<br />df<br />")
  end

end