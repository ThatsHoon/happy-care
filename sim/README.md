# happy_care_sim Package

ROS 2 Gazebo simulation for Happy Care robot environment.

## Quick Start

**Important**: Before building or running any Gazebo commands, set this environment variable to avoid online model database delays:

```bash
export GAZEBO_MODEL_DATABASE_URI=""
```

This disables remote model lookups, essential for offline environments and faster startup times.

Then build and run normally:

```bash
colcon build
source install/setup.bash
gzserver ./sim/worlds/happy_care_room.world
```

## Contents

- `worlds/`: SDF world files (happy_care_room.world)
- `CMakeLists.txt`: Build configuration
- `package.xml`: Package manifest
