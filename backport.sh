git reset HEAD~1
rm ./backport.sh
git cherry-pick 8239cbfa00f834d1c5af3a408060a6e1fde99ec5
echo 'Resolve conflicts and force push this branch.\n\nTo backport translations run: bin/i18n/merge-translations <release-branch>'
