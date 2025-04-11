FROM azul/zulu-openjdk:17.0.14-17.56

ENV HOME=/app
WORKDIR /app

RUN mkdir -p /app/.config/jgit && \
    chown -R 1001:1001 /app && \
    chmod -R 775 /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

ENV JAVA_OPTS="-Xmx512m -Xms512m -Duser.home=/app"

EXPOSE 8888

USER root
ARG JAR_FILE
COPY --chown=1001:1001 ${JAR_FILE} app.jar
USER 1001

HEALTHCHECK --interval=30s --timeout=5s --start-period=51s --retries=3 \
  CMD curl -f http://localhost:8888/actuator/health || exit 1

CMD java $JAVA_OPTS -jar app.jar
