#include <gazebo/common/Plugin.hh>
#include <gazebo/physics/physics.hh>
#include <gazebo_ros/node.hpp>
#include <rclcpp/rclcpp.hpp>
#include <geometry_msgs/msg/pose.hpp>
#include <std_msgs/msg/float64.hpp>
#include <std_msgs/msg/string.hpp>
#include <algorithm>

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

    actor_cmd_sub_ = ros_node_->create_subscription<std_msgs::msg::String>(
      "/happy_care/actor_cmd", 10,
      std::bind(&HappyCareWorldPlugin::OnActorCmd, this, std::placeholders::_1));

    last_update_time_ = world_->SimTime();
    transition_start_time_ = last_update_time_;
    auto person = world_->ModelByName(person_model_name_);
    if (person) {
      last_person_pos_ = person->WorldPose().Pos();
    }

    update_connection_ = gazebo::event::Events::ConnectWorldUpdateBegin(
      std::bind(&HappyCareWorldPlugin::OnUpdate, this));

    RCLCPP_INFO(ros_node_->get_logger(), "happy_care_world_plugin loaded");
  }

private:
  static ignition::math::Pose3d IdlePose()
  {
    return ignition::math::Pose3d(0, 0, 0.9, 0, 0, 0);
  }
  static ignition::math::Pose3d SitPose()
  {
    return ignition::math::Pose3d(0, 0, 0.5, 0, 0, 0);
  }
  static ignition::math::Pose3d LiePose()
  {
    return ignition::math::Pose3d(0, 0, 0.15, 0, 1.5708, 0);
  }
  static ignition::math::Pose3d FallPose()
  {
    return ignition::math::Pose3d(0, 0, 0.15, 0, 1.5708, 0.7);
  }

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

  void OnActorCmd(const std_msgs::msg::String::SharedPtr msg)
  {
    auto person = world_->ModelByName(person_model_name_);
    if (!person) {
      return;
    }

    ignition::math::Pose3d next_target;
    if (msg->data == "idle" || msg->data == "recover") {
      next_target = IdlePose();
    } else if (msg->data == "sit") {
      next_target = SitPose();
    } else if (msg->data == "lie") {
      next_target = LiePose();
    } else if (msg->data == "fall") {
      next_target = FallPose();
    } else {
      RCLCPP_WARN(ros_node_->get_logger(), "unknown actor_cmd: %s", msg->data.c_str());
      return;
    }

    start_pose_ = person->WorldPose();
    target_pose_ = next_target;
    transition_start_time_ = world_->SimTime();
  }

  void OnUpdate()
  {
    auto now = world_->SimTime();
    double dt = (now - last_update_time_).Double();
    if (dt <= 0) {
      last_update_time_ = now;
      transition_start_time_ = now;
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
      double t = std::min(
        1.0, (now - transition_start_time_).Double() / transition_duration_);
      ignition::math::Pose3d interp(
        start_pose_.Pos() + (target_pose_.Pos() - start_pose_.Pos()) * t,
        ignition::math::Quaterniond::Slerp(t, start_pose_.Rot(), target_pose_.Rot()));
      person->SetWorldPose(interp);

      person_pose_pub_->publish(ToMsg(interp));

      std_msgs::msg::Float64 speed_msg;
      speed_msg.data = (interp.Pos() - last_person_pos_).Length() / dt;
      person_speed_pub_->publish(speed_msg);
      last_person_pos_ = interp.Pos();
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

  rclcpp::Subscription<std_msgs::msg::String>::SharedPtr actor_cmd_sub_;
  ignition::math::Pose3d start_pose_{IdlePose()};
  ignition::math::Pose3d target_pose_{IdlePose()};
  gazebo::common::Time transition_start_time_;
  double transition_duration_ = 1.5;
};

GZ_REGISTER_WORLD_PLUGIN(HappyCareWorldPlugin)

}  // namespace happy_care_sim
