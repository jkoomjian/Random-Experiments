class IdeasController < ApplicationController
  
  def index
    list
    render :action => 'list'
  end

  # GETs should be safe (see http://www.w3.org/2001/tag/doc/whenToUseGet.html)
  verify :method => :post, :only => [ :destroy, :create, :update ],
         :redirect_to => { :action => :list }

  def list
    @tag_name = "All"
    #Return list of ideas in tag if tag is given, else return all ideas
    if params[:id].nil?
      #Paginate our list of ideas
      @idea_pages, @ideas = paginate :ideas, :per_page => 30, :conditions => "user_id = #{current_user.id}", :order_by => "score desc"
    else
      tag = Tag.find(params[:id])
      @tag_name = tag.name
      #finds with join tables are much easier in hql
      @idea_pages, @ideas = paginate :ideas, 
                                      :per_page => 30,
                                      :joins => "inner join ideas_tags it on id = it.idea_id",
                                      :conditions => "user_id = #{current_user.id} and it.tag_id = #{tag.id}", 
                                      :order_by => "score desc"
    end
  end

  def show
    @idea = Idea.find(params[:id])
  end

  def new
    @idea = Idea.new()
    ##For each active Criteria, create a new CriteriaResponse object for this idea
    @current_user.criterias.each(){|criteria| if criteria.active? then @idea.criteria_responses.build(:criteria => criteria) end}
  end

  def create
    #instantiate a new idea with the values from our form
    @idea = Idea.new(params[:idea])
    # Add each criteria response
    params[:criteria_response].each{|cr_params| @idea.criteria_responses << CriteriaResponse.new(cr_params) }
    @idea.user = @current_user
    add_tags(@idea, params[:tag])
    
    if @idea.save
      flash[:notice] = 'Idea was successfully created.'
      redirect_to :action => 'list'
    else
      render :action => 'new'
    end
  end

  def edit
    @idea = Idea.find(params[:id])
  end

  def update
    @idea = Idea.find(params[:id])
    if !params[:criteria_response].nil?
      params[:criteria_response].each{|key, cr_params| CriteriaResponse.find(key).update_attributes(cr_params) }
    end
    add_tags(@idea, params[:tag])
    
    if @idea.update_attributes(params[:idea])
      flash[:notice] = 'Idea was successfully updated.'
      redirect_to :action => 'show', :id => @idea
    else
      render :action => 'edit'
    end
  end

  def destroy
    Idea.find(params[:id]).destroy
    redirect_to :action => 'list'
  end
  
  def update_tags
    @idea = Idea.find(params[:id])
    add_tags(@idea, params[:tag])
    render(:layout => false)
  end
    
  def update_summary
    @idea = Idea.find(params[:id])
    @idea.update_attributes(params[:idea])  #real men don't need any error handling
    render(:layout => false)
  end

  def update_criteria_response
    @criteria_response = CriteriaResponse.find(params[:id])
    @criteria_response.update_attributes(params[:criteria_response])
    @criteria_response.idea.save #to update the idea score
    render(:layout => false)
  end
  
  protected
    
    #require authentication for all pages in plans controller
    before_filter :login_required
    
    #TODO add support for removing tags from ideas
    def add_tags(idea, tags_array_param)
      return if tags_array_param.nil?
      tag_names = Array.new  ##define the array here so it is visable outside the each loop
      
      tags_array_param.each{|tag_array|
        tag_name = tag_array[:name];
        puts "evaluating tag: #{tag_name}"
        next if tag_name == ""
        ##split tags by ','
        tag_name.split(',').each{|name| tag_names << name.strip}
      }
      
      ##iterate though all new tags- try to get the tag, otherwise create a new one
      tag_names.each{|name|
        curr_tag = Tag.find_by_name(name, @current_user) || Tag.new(:name => name, :user => idea.user)
        if !idea.tags.include?(curr_tag)
          idea.tags << curr_tag
        end
      }
    end
  
end