class CriteriaController < ApplicationController
  def index
    list
    render :action => 'list'
  end

  # GETs should be safe (see http://www.w3.org/2001/tag/doc/whenToUseGet.html)
  verify :method => :post, :only => [ :destroy, :create, :update ],
         :redirect_to => { :action => :list }

  def list
    @criteria_pages, @criterias = paginate :criterias, 
                                            :per_page => 30,
                                            :conditions => "user_id = #{current_user.id}", 
                                            :order_by => "criteria_order asc"
  end

  def show
    @criteria = Criteria.find(params[:id])
  end

  def new
    @criterias = current_user.criterias
    @criteria = Criteria.new
  end

  def create
    params[:criteria].each{|s| puts s}
    ## make sure we save the user with the criteria
    params[:criteria][:user_id] = current_user.id ##calls the current_user method in AuthenticatedSystem
    @criteria = Criteria.new(params[:criteria])
    if @criteria.save
      flash[:notice] = 'Criteria was successfully created.'
      redirect_to :action => 'list', :id => @criteria
    else
      render :action => 'new'
    end
  end

  def edit
    puts "user_id = #{current_user.id}"
    @criterias = current_user.criterias
    @criteria = Criteria.find(params[:id])
  end

  def update
    @criteria = Criteria.find(params[:id])
    if @criteria.update_attributes(params[:criteria])
      flash[:notice] = 'Criteria was successfully updated.'
      redirect_to :action => 'list', :id => @criteria
    else
      render :action => 'edit'
    end
  end

  def destroy
    Criteria.find(params[:id]).destroy
    redirect_to :action => 'list'
  end
  
  protected
    
    #require authentication for all pages in plans controller
    before_filter :login_required
    
end