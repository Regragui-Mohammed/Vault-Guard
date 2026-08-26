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

echo "[INFO] Syncing Data with rsync..."
if [ -d "$LATEST_LINK" ]; then
	rsync -a --delete --link-dest="$LATEST_LINK" "$SOURCE_DIR/" "$NEW_BACKUP_DIR/"
else
	rsync -a "$SOURCE_DIR/" "$NEW_BACKUP_DIR/"
fi
rm -f "$LATEST_LINK"
ln -s "$NEW_BACKUP_DIR" "$LATEST_LINK"

echo "[INFO] Creating Tar Archive..."
tar -cf "$TAR_FILE" -C "$STAGING_DIR" "backup-$TIMESTAMP"

echo "[SUCCESS] Backup Engine completed Successfully."
echo " Archive saved at : $TAR_FILE" 
