FROM azul/zulu-openjdk:17.0.14-17.56
WORKDIR /app

ENV JAVA_OPTS="-Xmx768m -Xms512m"

EXPOSE 8100
USER 1001

ARG JAR_FILE
COPY ${JAR_FILE} app.jar

CMD java $JAVA_OPTS -jar app.jar