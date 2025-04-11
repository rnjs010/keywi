#!/bin/bash
set -e
install_opencv () {

echo ""
echo "Installing OpenCV Lastest"
echo ""

cd ~
# install the dependencies
sudo apt-get install -y build-essential cmake git unzip pkg-config
sudo apt-get install -y libjpeg-dev libtiff5-dev libpng-dev
sudo apt-get install -y ffmpeg libavcodec-dev libavformat-dev libswscale-dev
sudo apt-get install -y libgtk2.0-dev libcanberra-gtk* libgtk-3-dev
sudo apt-get install -y libgstreamer1.0-dev gstreamer1.0-gtk3
sudo apt-get install -y libgstreamer-plugins-base1.0-dev gstreamer1.0-gl
sudo apt-get install -y libxvidcore-dev libx264-dev
sudo apt-get install -y python3-dev python3-numpy python3-pip
sudo apt-get install -y libv4l-dev v4l-utils
sudo apt-get install -y libopenblas-dev libatlas-base-dev libblas-dev
sudo apt-get install -y liblapack-dev gfortran libhdf5-dev libeigen3-dev
sudo apt-get install -y libprotobuf-dev libgoogle-glog-dev libgflags-dev
sudo apt-get install -y protobuf-compiler
sudo apt-get install -y libtbbmalloc2 libtbb-dev libdc1394-dev
sudo apt-get install -y python3-dev python3-numpy

echo ""
echo "apt install completed."
echo ""

# download the latest version
cd ~
sudo rm -rf opencv*
echo ""
git clone --depth=1 https://github.com/opencv/opencv.git
echo ""
git clone --depth=1 https://github.com/opencv/opencv_contrib.git

# set install dir
cd ~/opencv
mkdir build
cd build

echo ""

# run cmake
cmake -D CMAKE_BUILD_TYPE=RELEASE \
-D CMAKE_INSTALL_PREFIX=/usr/local \
-D INSTALL_PYTHON_EXAMPLES=ON \
-D INSTALL_C_EXAMPLES=ON \
-D BUILD_DOCS=OFF \
-D BUILD_PERF_TESTS=OFF \
-D BUILD_TESTS=OFF \
-D BUILD_PACKAGE=OFF \
-D BUILD_EXAMPLES=OFF \
-D WITH_TBB=ON \
-D ENABLE_FAST_MATH=1 \
-D CUDA_FAST_MATH=1 \
-D CUDA_TOOLKIT_ROOT_DIR=/usr/local/cuda \
-D WITH_CUDA=ON \
-D WITH_CUBLAS=ON \
-D WITH_CUFFT=ON \
-D WITH_NVCUVID=ON \
-D WITH_IPP=OFF \
-D WITH_V4L=ON \
-D WITH_LIBV4L=ON \
-D WITH_1394=OFF \
-D WITH_GTK=ON \
-D WITH_QT=OFF \
-D WITH_OPENGL=ON \
-D WITH_EIGEN=ON \
-D WITH_FFMPEG=ON \
-D WITH_GSTREAMER=ON \
-D BUILD_JAVA=OFF \
-D BUILD_opencv_python3=ON \
-D BUILD_opencv_python2=OFF \
-D BUILD_NEW_PYTHON_SUPPORT=ON \
-D OPENCV_SKIP_PYTHON_LOADER=ON \
-D OPENCV_GENERATE_PKGCONFIG=ON \
-D OPENCV_ENABLE_NONFREE=ON \
-D OPENCV_EXTRA_MODULES_PATH=~/opencv_contrib/modules \
-D WITH_CUDNN=ON \
-D OPENCV_DNN_CUDA=ON \
-D CUDA_ARCH_BIN=6.1 \
-D CUDA_ARCH_PTX=6.1 \
-D CUDNN_LIBRARY=/usr/local/cuda/lib64/libcudnn.so.9.8.0 \
-D CUDNN_INCLUDE_DIR=/usr/local/cuda/include \
-D PYTHON3_PACKAGES_PATH=/usr/local/lib/python3.10/dist-packages  ..
echo ""

# run make
time make -j4 # cpu 리소스 초과 안되게 제한
# time make -j$(($(nproc) / 2)) 절반 사용
# time make -j$(nproc) 풀로 쓰기
echo ""
sudo make install
echo ""
sudo ldconfig

make clean
sudo apt-get update

echo ""
echo "Install Completed!"
echo ""
}

cd ~

if [ -d ~/opencv/build ]; then
  echo " "
  echo "You have a directory ~/opencv/build on your disk."
  echo "Continuing the installation will replace this folder."
  echo " "

  printf "Do you wish to continue (Y/n)?"
  read answer

  if [ "$answer" != "${answer#[Nn]}" ] ;then
      echo "Leaving without installing OpenCV"
  else
      install_opencv
  fi
else
    install_opencv
fi