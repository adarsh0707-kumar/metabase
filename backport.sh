git reset HEAD~1
rm ./backport.sh
git cherry-pick ea30b8973d1a22369b298cbf176c9aa9f539633d
echo 'Resolve conflicts and force push this branch.\n\nTo backport translations run: bin/i18n/merge-translations <release-branch>'
