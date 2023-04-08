# Step 1: Choose the base image
FROM ubuntu:20.04

# Step 2: Install dependencies
RUN apt-get update && \
    apt-get install -y default-jre wget unzip && \
    apt-get clean

# Step 3: Download Trimmomatic
RUN wget http://www.usadellab.org/cms/uploads/supplementary/Trimmomatic/Trimmomatic-0.39.zip && \
    unzip Trimmomatic-0.39.zip

# Step 4: Install Trimmomatic
WORKDIR /Trimmomatic-0.39
RUN chmod +x trimmomatic-0.39.jar && \
    ln -s /Trimmomatic-0.39/trimmomatic-0.39.jar /usr/local/bin/trimmomatic

# Step 5: Set the environment variables
ENV TRIMMOMATIC_HOME /Trimmomatic-0.39

# Step 6: Expose any required ports
EXPOSE 8080

# Step 7: Define the entry point
ENTRYPOINT ["java", "-jar", "/Trimmomatic-0.39/trimmomatic-0.39.jar"]
