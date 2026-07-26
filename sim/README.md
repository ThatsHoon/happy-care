# happy_care_sim Package

Happy Care 로봇을 위한 ROS 2 + Gazebo Classic 11 시뮬레이션. 원룸 월드에서
로봇(`haengbogi`)과 어르신(person actor)을 시뮬레이션하고, 로봇 pose/카메라,
어르신 pose/속도, 도킹 거리 등의 ground-truth 토픽을 발행하는
`WorldPlugin`(`happy_care_world_plugin`)을 포함한다.

## 1. 콜콘 워크스페이스 셋업 (최초 1회)

이 레포는 `~/happy_care_ws`라는 별도 콜콘 워크스페이스에 심볼릭 링크로 연결해서
빌드한다(레포 자체가 콜콘 워크스페이스 루트가 아님).

```bash
mkdir -p ~/happy_care_ws/src
ln -sf <이 레포의 sim 절대경로> ~/happy_care_ws/src/happy_care_sim
cd ~/happy_care_ws
colcon build --packages-select happy_care_sim
```

예: `ln -sf /home/hoon/happy-care/.claude/worktrees/gazebo-sim-plugin/sim ~/happy_care_ws/src/happy_care_sim`

## 2. 빌드 후 매번 필요한 것

Gazebo가 온라인 모델 데이터베이스를 조회하면서 기동이 지연되거나 아예 멈추는
문제를 막기 위해, 실행 전에 항상 아래를 설정한다.

```bash
export GAZEBO_MODEL_DATABASE_URI=""
```

## 3. 이 개발 머신 한정 이슈: `setup.bash` 대신 `local_setup.bash`

이 머신의 `~/.bashrc`는 `cobot_ws`를 기본으로 자동 소싱한다. `cobot_ws` 안에
깨진 심볼릭 링크가 있어서, `~/happy_care_ws/install/setup.bash`(상위/체이닝 버전)를
소싱하면 그 체이닝 과정에서 `ros2 launch`가 죽는다.

`happy_care_sim`이 필요로 하는 의존성(`gazebo_ros`, `robot_state_publisher`,
`web_video_server` 등)은 전부 `/opt/ros/humble`이 이미 제공하므로, 체이닝 없이
이 워크스페이스만 로드하는 `local_setup.bash`를 쓰면 문제없이 동작한다.

```bash
source /opt/ros/humble/setup.bash
source ~/happy_care_ws/install/local_setup.bash   # setup.bash 아님, local_setup.bash
```

## 4. `DISPLAY` 관련 매우 중요한 경고

격리된 셸(`env -i` 등)에서 실행할 경우 `DISPLAY` 환경변수를 반드시 함께
유지해야 한다.

```bash
env -i HOME="$HOME" DISPLAY="$DISPLAY" bash --noprofile --norc -c '
  source /opt/ros/humble/setup.bash
  source ~/happy_care_ws/install/local_setup.bash
  export GAZEBO_MODEL_DATABASE_URI=""
  ros2 launch happy_care_sim happy_care_sim.launch.py
'
```

`DISPLAY`가 없으면 Gazebo의 렌더링 엔진이 초기화되지 않아 카메라 센서 자체가
생성되지 않고, 그 결과 `/happy_care/robot/camera/image_raw` 토픽이 전혀
발행되지 않는다. 카메라 관련 코드 자체는 정상이며, 순전히 환경변수 문제다.

## 5. 실행: 반드시 `ros2 launch` 사용 (`gzserver` 직접 실행 금지)

`gzserver <world 경로>`를 직접 실행하면 `GAZEBO_PLUGIN_PATH`가 설정되지 않아
`libhappy_care_world_plugin.so`를 찾지 못하고 WorldPlugin이 로드되지 않는다
(ground-truth 토픽들이 전혀 뜨지 않게 됨). 반드시 `ros2 launch`로 기동한다.

```bash
source /opt/ros/humble/setup.bash
source ~/happy_care_ws/install/local_setup.bash
export GAZEBO_MODEL_DATABASE_URI=""
ros2 launch happy_care_sim happy_care_sim.launch.py
```

`web_video_server` 포트를 바꾸려면:

```bash
ros2 launch happy_care_sim happy_care_sim.launch.py port:=8080
```

## 6. 알려진 제약사항

- **로봇 표류(drift)**: 로봇이 스폰된 직후 물리 접촉솔버 특성으로 인해 초기
  위치 (0,0)에서 최대 약 0.5 m / 28도 정도 표류하는 현상이 있다. 이로 인해
  `/happy_care/robot/dock_distance` 값에 최대 약 11% 오차가 발생할 수 있다.
  근본 원인은 아직 규명되지 않았고, 마찰 파라미터 조정만으로는 해결되지 않음을
  이미 확인했다. 도킹 판정(도착 여부 등) 로직을 만들 때는 이 오차 범위를
  감안해서 임계값을 설정해야 한다.
- **월드 리셋 후 재동기화**: `world_plugin.cpp`의 `OnUpdate()`는 `SimTime()`이
  역행/정지하는 리셋 프레임에서 `last_update_time_`/`transition_start_time_`을
  재동기화하도록 되어 있다(리셋 직후 dt<=0 프레임에서 내부 시각을 갱신). 이
  처리가 없으면 리셋 이후 ground-truth 토픽이 영구히 멈추는 문제가 있었다.

## 7. 패키지 구성

- `worlds/`: SDF 월드 파일(`happy_care_room.world`) — 원룸 환경, 도킹 스테이션 등 배치
- `urdf/`: 로봇(`haengbogi`) URDF 모델
- `src/`: `WorldPlugin` C++ 소스(`world_plugin.cpp`) — 로봇/사람 pose, 도킹 거리, 사람 속도 등 ground-truth 토픽 발행
- `launch/`: `happy_care_sim.launch.py` — Gazebo, robot_state_publisher, spawn_entity, web_video_server를 한 번에 기동하는 통합 launch 파일
- `CMakeLists.txt`, `package.xml`: 빌드/패키지 설정
