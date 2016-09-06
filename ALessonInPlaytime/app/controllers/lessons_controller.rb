class LessonsController < Cms::ApplicationController

  layout false

  def query

    if params[:tag]
      @lessons = Lesson.tagged_with(params[:tag]).reverse
    end

    if params[:category]
      category_type = Cms::CategoryType.named("Lesson").first
      category = category_type.categories.named(params[:category]).first
      @lessons = Lesson.published.in_category(category).reverse
    end

    @lessons ||= Lesson.published.order("created_at desc")

    if params[:search]
      # TODO real search- try mysql5.6 or redis or solr
      query = ["name", "lesson_focus", "location", "objective", "milestone", 
              "materials", "lesson_prep", "lesson_plan"].map{|i|
                "#{i} like ?"
              }.join(" or ")
      myargs = [].fill("%#{params[:search]}%", 0, 8)
      @lessons = @lessons.where(query, *myargs)
    end

    if params[:age]
      @lessons = @lessons.where("suggested_age_min <= ? and ? <= suggested_age_max", params[:age], params[:age])
    end

    if params[:focus]
      @lessons = @lessons.where("find_in_set(?, lesson_focus) or find_in_set(?, lesson_focus)", params[:focus], " " + params[:focus])
    end

    render :layout => false
  end

end