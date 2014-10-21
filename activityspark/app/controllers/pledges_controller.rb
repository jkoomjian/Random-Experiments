class PledgesController < ApplicationController
  # GET /pledges
  # GET /pledges.json
  def index
    @pledges = Pledge.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @pledges }
    end
  end

  # GET /pledges/1
  # GET /pledges/1.json
  def show
    @pledge = Pledge.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render :json => @pledge }
    end
  end

  # GET /pledges/new
  # GET /pledges/new.json
  def new
    @pledge = Pledge.new

    if params[:event_id]
      event = Event.find(params[:event_id])
      @pledge.title = event.title
      @pledge.location = event.location
    end

    respond_to do |format|
      format.html # new.html.erb
    end
  end
  
  def update
	@pledge = Pledge.find(params[:pledge_id])
	redirect_to :action => 'show', :id => @pledge.id
  end
  
  # GET /pledges/1/edit
  # def edit
    # @pledge = Pledge.find(params[:id])
  # end

  # POST /pledges
  # POST /pledges.json
  def create
    @pledge = Pledge.new(params[:pledge])
    
    @pledge.curr_num_pledged = 1;
    @pledge.status = "unpurchased"
      if @pledge.save
        redirect_to :action => 'add_payment', :id => @pledge.id
      else
        format.html { render :action => "successful_pledge" }
      end
  end
  
  def add_payment
    @pledge = Pledge.find(params[:id])
  end
  
  def save_payment
    @pledge = Pledge.find(params[:pledge_id])
	
	@participant = Participant.new(params[:participant])
	@participant.save
	
    @pledge.participants << @participant
	@pledge.host_id = @participant.id
	
    respond_to do |format|
      if @pledge.save
        format.html { redirect_to :action=> "add_friends", :id=>@pledge.id}
     # else
    #    format.html { render :action => "new" }
      end
    end
  end
  
  def add_friends
      @pledge = Pledge.find(params[:id])
	  @host = Participant.find(@pledge.host_id)
  end
  
  def save_friends
    @pledge = Pledge.find(params[:id])
	@host = Participant.find(@pledge.host_id)

    #split emails
    params[:all_emails].split(/\s/).each() {|s|
      s = s.strip
      if s && s.length > 0
        participant = Participant.new()
        participant.email_addr = s
        @pledge.participants << participant
      end
    }
    
    #Now send the invite emails
    send_invites(@pledge, params[:message])
    
    respond_to do |format|
      if @pledge.save
        format.html { redirect_to :action=> "successful_pledge", :id=>@pledge.id}
      else
        format.html { render :action => "successful_pledge" }
      end
    end
  end

  def successful_pledge
    @pledge = Pledge.find(params[:id])
  end

  def accept_invite
    @pledge = Pledge.find(params[:id])
    @participant = Participant.find(params[:user])
  end
  
  def save_accept_invite
    @pledge = Pledge.find(params[:id])
    @pledge.curr_num_pledged = @pledge.curr_num_pledged + 1
    @pledge.save
    if @pledge.curr_num_pledged >= @pledge.num_people_required
      send_matched(@pledge)
    end
  end
  

  # DELETE /pledges/1
  # DELETE /pledges/1.json
  def destroy
    @pledge = Pledge.find(params[:id])
    @pledge.destroy

    respond_to do |format|
      format.html { redirect_to pledges_url }
      format.json { head :ok }
    end
  end
end