class UpdateUsersAddTrialStartPaymentStatus < ActiveRecord::Migration
  def up
    add_column prefix(:users), :trial_start, :date
    add_column prefix(:users), :subscription_status, :string
  end

  def down
    remove_column prefix(:users), :trial_start
    remove_column prefix(:users), :subscription_status
  end
end
