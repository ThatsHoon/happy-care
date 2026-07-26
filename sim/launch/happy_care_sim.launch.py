import os
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node
from ament_index_python.packages import get_package_share_directory


def generate_launch_description():
    pkg_share = get_package_share_directory('happy_care_sim')
    world_path = os.path.join(pkg_share, 'worlds', 'happy_care_room.world')
    urdf_path = os.path.join(pkg_share, 'urdf', 'haengbogi.urdf')

    with open(urdf_path, 'r') as f:
        robot_description = f.read()

    gazebo = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(
            os.path.join(
                get_package_share_directory('gazebo_ros'),
                'launch', 'gazebo.launch.py')
        ),
        launch_arguments={'world': world_path}.items()
    )

    robot_state_publisher = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        namespace='happy_care/robot',
        parameters=[{'robot_description': robot_description}, {'use_sim_time': True}],
    )

    spawn_robot = Node(
        package='gazebo_ros',
        executable='spawn_entity.py',
        arguments=[
            '-entity', 'haengbogi',
            '-topic', '/happy_care/robot/robot_description',
            '-x', '0', '-y', '0', '-z', '0.2',
        ],
        output='screen',
    )

    web_video_server = Node(
        package='web_video_server',
        executable='web_video_server',
        parameters=[{'port': LaunchConfiguration('port')}],
    )

    return LaunchDescription([
        DeclareLaunchArgument('port', default_value='8080', description='web_video_server port'),
        gazebo,
        robot_state_publisher,
        spawn_robot,
        web_video_server,
    ])
