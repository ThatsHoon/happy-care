#include <gazebo/common/Plugin.hh>
#include <gazebo/physics/physics.hh>
#include <gazebo_ros/node.hpp>
#include <rclcpp/rclcpp.hpp>
#include <geometry_msgs/msg/pose.hpp>
#include <std_msgs/msg/float64.hpp>

namespace happy_care_sim
{

class HappyCareWorldPlugin : public gazebo::WorldPlugin
{
public:
  void Load(gazebo::physics::WorldPtr world, sdf::ElementPtr sdf) override
  {
    world_ = world;
    ros_node_ = gazebo_ros::Node::Get(sdf);

    robot_model_name_ = sdf->Get<std::string>("robot_model", "haengbogi").first;
    station_model_name_ = sdf->Get<std::string>("station_model", "charging_station").first;
    person_model_name_ = sdf->Get<std::string>("person_model", "person").first;

    robot_pose_pub_ = ros_node_->create_publisher<geometry_msgs::msg::Pose>(
      "/happy_care/robot/pose", 10);
    dock_distance_pub_ = ros_node_->create_publisher<std_msgs::msg::Float64>(
      "/happy_care/robot/dock_distance", 10);
    person_pose_pub_ = ros_node_->create_publisher<geometry_msgs::msg::Pose>(
      "/happy_care/person/pose", 10);
    person_speed_pub_ = ros_node_->create_publisher<std_msgs::msg::Float64>(
      "/happy_care/person/torso_speed", 10);

    last_update_time_ = world_->SimTime();
    auto person = world_->ModelByName(person_model_name_);
    if (person) {
      last_person_pos_ = person->WorldPose().Pos();
    }

    update_connection_ = gazebo::event::Events::ConnectWorldUpdateBegin(
      std::bind(&HappyCareWorldPlugin::OnUpdate, this));

    RCLCPP_INFO(ros_node_->get_logger(), "happy_care_world_plugin loaded");
  }

private:
  static geometry_msgs::msg::Pose ToMsg(const ignition::math::Pose3d & p)
  {
    geometry_msgs::msg::Pose msg;
    msg.position.x = p.Pos().X();
    msg.position.y = p.Pos().Y();
    msg.position.z = p.Pos().Z();
    msg.orientation.x = p.Rot().X();
    msg.orientation.y = p.Rot().Y();
    msg.orientation.z = p.Rot().Z();
    msg.orientation.w = p.Rot().W();
    return msg;
  }

  void OnUpdate()
  {
    auto now = world_->SimTime();
    double dt = (now - last_update_time_).Double();
    if (dt <= 0) {
      return;
    }

    auto robot = world_->ModelByName(robot_model_name_);
    auto station = world_->ModelByName(station_model_name_);
    if (robot && station) {
      auto robot_pose = robot->WorldPose();
      robot_pose_pub_->publish(ToMsg(robot_pose));

      std_msgs::msg::Float64 dist_msg;
      dist_msg.data = robot_pose.Pos().Distance(station->WorldPose().Pos());
      dock_distance_pub_->publish(dist_msg);
    }

    auto person = world_->ModelByName(person_model_name_);
    if (person) {
      auto person_pose = person->WorldPose();
      person_pose_pub_->publish(ToMsg(person_pose));

      std_msgs::msg::Float64 speed_msg;
      speed_msg.data = (person_pose.Pos() - last_person_pos_).Length() / dt;
      person_speed_pub_->publish(speed_msg);
      last_person_pos_ = person_pose.Pos();
    }

    last_update_time_ = now;
  }

  gazebo::physics::WorldPtr world_;
  gazebo_ros::Node::SharedPtr ros_node_;
  gazebo::event::ConnectionPtr update_connection_;

  std::string robot_model_name_, station_model_name_, person_model_name_;

  rclcpp::Publisher<geometry_msgs::msg::Pose>::SharedPtr robot_pose_pub_;
  rclcpp::Publisher<std_msgs::msg::Float64>::SharedPtr dock_distance_pub_;
  rclcpp::Publisher<geometry_msgs::msg::Pose>::SharedPtr person_pose_pub_;
  rclcpp::Publisher<std_msgs::msg::Float64>::SharedPtr person_speed_pub_;

  gazebo::common::Time last_update_time_;
  ignition::math::Vector3d last_person_pos_{0, 0, 0};
};

GZ_REGISTER_WORLD_PLUGIN(HappyCareWorldPlugin)

}  // namespace happy_care_sim
