  GNU nano 8.7                                                                                     /srv/vaultguard/scripts/vault-retention.sh *                                                                                             
-#!/bin/bash

set -eo pipefail

#============Var=============
ARCHIVES="/srv/vaultguard/archives"
RETENTION_DAYS=30

#==========Function==========
log_retention(){
        local L="$1"
        local MSG="$2"
        local FORMATED="[$L] $MSG"
        echo "$FORMATED"
        logger -t Vault-Retention "$FORMATED"
}

#==========Script============
log_retention "INFO" "Starting Vault-Guard Retention purge cyvle..."

if [ ! -d "$ARCHIVES" ]; then
        log_retention "ERROR" "Target Directory $ARCHIVES Does Not Exist."
        exit 1
fi

FOUND_COUNT=0

while IFS= read -r -d '' file; do
        log_retention "INFO" "Processing expired Target: $file"
        if sudo /usr/bin/chattr -i "$file"; then
                log_retention "INFO" "Successfully Unlocked Immutability on: $file"
        else 
                log_retention "ERROR" "Failed to Clear Immutability on: $file"
                continue
        fi

        if rm -f "$file"; then
                log_retention "SUCCESS" "Deleted Expired Archive: $file"
                FOUND_COUNT=$((FOUND_COUNT + 1))
        else
                log_retention "ERROR" "Failed to Delete File: $file"
        fi

done <<(find "$AECHIVES" -maxdepht 1 -type f \ ( -name "backup-*.tar.gpg" -o -name "backup-*.tar.gpg.sha256" \) -mtime +"RETENTION_DATS" -print0)

log_retention "SUCCESS" "Retention Cycle Completed. Total Expired File Purged: $FOUNT_COUNT"

exit 0
