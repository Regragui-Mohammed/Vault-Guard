#!/bin/bash

set -e

# ======Variable======
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
SOURCE_DIR="/etc"

STAGING_DIR="/srv/vaultguard/staging"
ARCHIVES_DIR="/srv/vaultguard/archives"
NEW_BACKUP_DIR="$STAGING_DIR/backup-$TIMESTAMP"
LATEST_LINK="$STAGING_DIR/latest"
TAR_FILE="$ARCHIVES_DIR/backup-$TIMESTAMP.tar"

# =====Function======
log_msg() {
        local MSG=$1
        echo "$MSG"
        logger -t Vault-Guard "$MSG"
}
cleanup(){
	log_msg "[INFO] Cleaning Up..."
	if [ -f "$TAR_FILE" ]; then
		rm -f "$TAR_FILE"
	fi
}
trap cleanup EXIT ERR INT

#===================

log_msg "[INFO] Syncing Data with rsync..."
if [ -d "$LATEST_LINK" ]; then
	rsync -a --delete --link-dest="$LATEST_LINK" "$SOURCE_DIR/" "$NEW_BACKUP_DIR/"
else
	rsync -a "$SOURCE_DIR/" "$NEW_BACKUP_DIR/"
fi
rm -f "$LATEST_LINK"
ln -s "$NEW_BACKUP_DIR" "$LATEST_LINK"

log_msg "[INFO] Creating Tar Archive..."
tar -cf "$TAR_FILE" -C "$STAGING_DIR" "backup-$TIMESTAMP"

log_msg "[SUCCESS] Backup Engine completed Successfully."
log_msg " Archive saved at : $TAR_FILE" 

GPG_RECIPIENT="VaultGuard"

log_msg "[INFO] Encrypting Archive with GPG..."
gpg --batch --yes --trust-model always -r "$GPG_RECIPIENT" -e "$TAR_FILE"

log_msg "[INFO] Generating SHA256 CheckSum ..."
sha256sum "$TAR_FILE.gpg" > "$TAR_FILE.gpg.sha256"

log_msg "[INFO] Applying Immutability Lock..."
sudo chattr +i "$TAR_FILE.gpg"
sudo chattr +i "$TAR_FILE.gpg.sha256"

rm -f "$TAR_FILE"

log_msg "[SUCCESS] Vault-Guard Backup Completed + Encrypted + Locked " 
