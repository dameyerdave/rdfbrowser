# rdfstore test

## AnzoGraph Configuration

Configure AnzoGraph to store the data on storage (not in memory).

```bash
vi /opt/../config/settings.conf
paged_data=true
```

## GraphDB Configuration

```bash
$ console
> create graphdb
Please specify values for the following variables:
Repository ID [repo-test]: default
Repository description: This is the default repo
Read-only [false]:
Ruleset [rdfsplus-optimized]:
Disable owl:sameAs [true]:
Enable consistency checks [false]:
Entity ID size [32]:
Enable context index [false]:
Enable predicate list index [true]:
Enable full-text search (FTS) index [false]:
FTS indexes to build (comma delimited) [default, iri]:
FTS index for xsd:string literals [default]:
FTS index for full-text indexing of IRIs [none]:
Query timeout (seconds) [0]:
Throw exception on query timeout [false]:
Limit query results [0]:
Repository created
> exit
```
