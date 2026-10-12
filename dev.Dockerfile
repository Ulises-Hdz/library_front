FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive
RUN echo "APT::Get::Assume-Yes \"true\";" > /etc/apt/apt.conf.d/90assumeyes
RUN apt update && apt upgrade -y && apt install software-properties-common -y && add-apt-repository ppa:deadsnakes/ppa
RUN apt install -y ca-certificates curl jq git iputils-ping libcurl4 \
libicu-dev libunwind8 netcat libltdl7 gnupg lsb-release

WORKDIR /app
RUN cd ~ && curl -sL https://deb.nodesource.com/setup_22.x | bash - && apt -y install nodejs
RUN npm install -g @angular/cli
RUN npm install -g @angular/common
RUN npm install -g @angular/cdk@latest
RUN npm install -g @angular-devkit/build-angular

CMD tail -f /dev/null