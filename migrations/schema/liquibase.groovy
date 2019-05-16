#!/usr/bin/env groovy

@GrabResolver(name = 'sonatype', root = 'https://oss.sonatype.org/content/repositories/snapshots')
@Grapes([
    @Grab(group = 'org.postgresql', module = 'postgresql', version = '42.2.4'),
    @Grab(group = 'org.liquibase', module = 'liquibase-core', version = '3.6.2'),
    @Grab(group = 'org.liquibase.ext', module = 'liquibase-postgresql', version = '3.0'),
])
import liquibase.integration.commandline.Main

def env = System.getenv()

def credentials = [
    'name'    : env['PGDATABASE'] ?: 'apiko_courses',
    'user'    : env['PGUSER'] ?: 'apiko_courses',
    'password': env['PGPASSWORD'] ?: 'apiko_courses',
    'host'    : env['PGHOST'] ?: 'localhost',
    'port'    : env['PGPORT'] ?: '5432',
    'rootcert': env['PGSSLROOTCERT'] ?: '~/.postgresql/server.crt',
    'useSSL'  : false
]

// Map of changelog properties
def changelogProperties = []

def connectionOpts = [
//    --liquibaseSchemaName doesn't work right now
//    https://liquibase.jira.com/projects/CORE/issues/CORE-3286
//    "--liquibaseSchemaName=migrations",
//    "--defaultSchemaName=public",

    "--changeLogFile=changelog.xml",
    "--driver=org.postgresql.Driver",
    "--databaseClass=liquibase.database.core.PostgresDatabase",
    "--username=$credentials.user",
    "--password=$credentials.password",
]

if (credentials.useSSL) {
    connectionOpts.add(
        "--url=\"jdbc:postgresql://$credentials.host:$credentials.port/$credentials.name?ssl=true&" +
            "sslfactory=org.postgresql.ssl.NonValidatingFactory\""
        // Add a root cert to ensure that there's no MitM
        // "sslfactory=org.postgresql.ssl.SingleCertValidatingFactory&sslfactoryarg=file:$credentials.rootcert\""
    )
} else {
    connectionOpts.add("--url=\"jdbc:postgresql://$credentials.host:$credentials.port/$credentials.name")
}

def actions = [
    'update',
    'updateCount',
    'updateSQL',
    'updateCountSQL',
    'rollback',
    'rollbackToDate',
    'rollbackCount',
    'rollbackSQL',
    'rollbackToDateSQL',
    'rollbackCountSQL',
    'futureRollbackSQL',
    'updateTestingRollback',
    'generateChangeLog',
    'diff',
    'diffChangeLog',
    'dbDoc',
    'tag',
    'tagExists',
    'status',
    'validate',
    'changelogSync',
    'changelogSyncSQL',
    'markNextChangeSetRan',
    'listLocks',
    'releaseLocks',
    'dropAll',
    'clearCheckSums',
]

def opts = []

if (!changelogProperties.empty) {
    opts.addAll(a.collect { k, v -> "-D$k=$v" })
}

if (args.length == 0) {
    opts.addAll(connectionOpts)
    opts.addAll(['status'])
} else if (!actions.contains(args[0])) {
    println "Unknown action: ${args[0]}\n\n"
    opts = ['--help']
} else {
    opts.addAll(connectionOpts)
    opts.addAll(args)
}

Main.run(opts as String[])
