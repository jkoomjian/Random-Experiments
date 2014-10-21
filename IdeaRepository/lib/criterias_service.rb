require 'yaml'

module CriteriasService
  protected
  
  def default_criterias(user_id)
    curr_criterias = Array.new()
    
    dc = YAML.load_file("components/default_criterias.yaml")
    
    dc.each{|curr_criteria_map|
      curr_criteria_map["user_id"] = user_id
      curr_criterias <<  Criteria.new(curr_criteria_map)
    }
    
    return curr_criterias
  end
  
end