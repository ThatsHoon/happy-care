cmake_minimum_required(VERSION 3.8)
project(happy_care_sim)

find_package(ament_cmake REQUIRED)
find_package(gazebo_ros REQUIRED)
find_package(gazebo_dev REQUIRED)
find_package(rclcpp REQUIRED)
find_package(geometry_msgs REQUIRED)
find_package(std_msgs REQUIRED)

add_library(happy_care_world_plugin SHARED
  src/world_plugin.cpp
)
ament_target_dependencies(happy_care_world_plugin
  gazebo_ros
  gazebo_dev
  rclcpp
  geometry_msgs
  std_msgs
)

install(TARGETS happy_care_world_plugin
  LIBRARY DESTINATION lib
)
install(DIRECTORY worlds urdf launch
  DESTINATION share/${PROJECT_NAME}
)

ament_package()
