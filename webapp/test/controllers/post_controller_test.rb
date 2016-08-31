require 'test_helper'

class PostControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get post_new_url
    assert_response :success
  end

  test "should get delete" do
    get post_delete_url
    assert_response :success
  end

  test "should get update" do
    get post_update_url
    assert_response :success
  end

end
