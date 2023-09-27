FROM ontotext/graphdb:10.3.3

COPY entrypoint.sh /entrypoint.sh
COPY start.sh /usr/bin/start
COPY stop.sh /usr/bin/stop

ENV GDB_JAVA_OPTS="-Dgraphdb.home=/opt/graphdb/home -Dgraphdb.logger.root.level=INFO"

ENTRYPOINT [ "/entrypoint.sh" ]