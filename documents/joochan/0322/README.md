# 3주차

## 25.03.22

### Ubuntu + wsl

oh-my-zsh

```bash
# 1. zsh 설치
sudo apt install zsh git fonts-powerline

# 2. oh-my-zsh 설치
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# or
sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"

# 3. 플러그인 설치
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

git clone https://github.com/zsh-users/zsh-autosuggestions.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# 4. 테마 설치
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k
echo 'source ~/powerlevel10k/powerlevel10k.zsh-theme' >>~/.zshrc

# 플러그인 적용
sudo nano ~/.zshrc
# zshrc 파일에 작성
plugins=(git zsh-syntax-highlighting zsh-autosuggestions)

source ~/.zshrc
# or
omz plugin enable zsh-syntax-highlighting zsh-autosuggestions
```

wsl cuda 설치

```bash
# cuda 12.1
wget https://developer.download.nvidia.com/compute/cuda/repos/wsl-ubuntu/x86_64/cuda-wsl-ubuntu.pin
sudo mv cuda-wsl-ubuntu.pin /etc/apt/preferences.d/cuda-repository-pin-600
wget https://developer.download.nvidia.com/compute/cuda/12.1.1/local_installers/cuda-repo-wsl-ubuntu-12-1-local_12.1.1-1_amd64.deb
sudo dpkg -i cuda-repo-wsl-ubuntu-12-1-local_12.1.1-1_amd64.deb
sudo cp /var/cuda-repo-wsl-ubuntu-12-1-local/cuda-*-keyring.gpg /usr/share/keyrings/
sudo apt-get update
sudo apt-get -y install cuda

# cudnn
wget https://developer.download.nvidia.com/compute/cudnn/redist/cudnn/linux-x86_64/cudnn-linux-x86_64-9.8.0.87_cuda12-archive.tar.xz
tar -xvf cudnn-linux-x86_64-9.8.0.87_cuda12-archive.tar.xz
cd cudnn-linux-x86_64-9.8.0.87_cuda12-archive
sudo cp include/cudnn*.h /usr/local/cuda-12.1/include
sudo cp lib/libcudnn* /usr/local/cuda-12.1/lib64

sudo nano ~/.zshrc #bashrc
# 런컴에 추가
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/cuda-12.1/lib64/
export PATH=$PATH:/usr/local/cuda-12.1/bin
export CUDADIR=/usr/local/cuda-12.1

source ~/.zshrc #bashrc

# 설치 확인
/usr/local/cuda-12.1/extras/demo_suite/deviceQuery
nvcc -V
```

cuda 라이브러리 파일 심볼릭 링크 수정( /sbin/ldconfig.real: /usr/lib/wsl/lib/libcuda.so.1 is not a symbolic link )

```bash
# 결과에 -> 기호 없으면 심볼릭 링크 아니므로 수정 필요
$ ls -l /usr/lib/wsl/lib/libcuda.so.1

# 파일존재 여부 확인
$ ls -l /usr/lib/wsl/lib/libcuda.so.1.1

# 기존파일 백업
$ sudo mv /usr/lib/wsl/lib/libcuda.so.1 /usr/lib/wsl/lib/libcuda.so.1.backup

# 심볼릭 링크 생성
$ sudo ln -s /usr/lib/wsl/lib/libcuda.so.1.1 /usr/lib/wsl/lib/libcuda.so.1

# 심볼릭 링크 생성 확인
$ ls -l /usr/lib/wsl/lib/libcuda.so.1
lrwxrwxrwx 1 root root 31 Mar 23 16:31 /usr/lib/wsl/lib/libcuda.so.1 -> /usr/lib/wsl/lib/libcuda.so.1.1
```

opencv

```bash
sudo chmod 755 ./opencv.sh
./opencv.sh
# cudnn 9.8.0, GTX1060, wsl(Ubuntu22.04) 기준
# pip로 설치해도 되긴 하나 종속성 에러 발생 가능성 존재.
```
