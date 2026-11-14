#!/bin/bash
# TrinkFest: AdMob in das iOS-Projekt einbauen (Mac).
# Aufruf im Projektordner:  bash scripts/admob-ios.sh ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY
# Die App-ID hat eine Tilde (~). Die Anzeigenblock-ID (mit /) kommt in config.js, nicht hierher.
set -e
APPID="$1"
if [[ ! "$APPID" =~ ^ca-app-pub-[0-9]{16}~[0-9]{10}$ ]]; then
  echo "Bitte die AdMob-App-ID angeben (mit Tilde ~), z. B.:"
  echo "  bash scripts/admob-ios.sh ca-app-pub-1234567890123456~1234567890"
  exit 1
fi
PL="ios/App/App/Info.plist"
[ -f "$PL" ] || { echo "ios/App/App/Info.plist fehlt. Erst 'npx cap add ios' ausführen."; exit 1; }

npm install @capacitor-community/admob
npm run build
npx cap sync ios

PB=/usr/libexec/PlistBuddy
setkey(){ $PB -c "Delete :$1" "$PL" 2>/dev/null || true; $PB -c "Add :$1 $2 $3" "$PL"; }
setkey GADApplicationIdentifier string "$APPID"
setkey NSUserTrackingUsageDescription string "Mit deiner Erlaubnis zeigen wir dir Werbung, die besser zu dir passt. Ohne Erlaubnis siehst du trotzdem Werbung, nur weniger passend."

$PB -c "Delete :SKAdNetworkItems" "$PL" 2>/dev/null || true
$PB -c "Add :SKAdNetworkItems array" "$PL"
i=0
for id in cstr6suwn9 4fzdc2evr5 2fnua5tdw4 ydx93a7ass p78axxw29g v72qych5uu ludvb6z3bs cp8zw746q7 3sh42y64q3 c6k4g5qg8m s39g8k73mm wg4vff78zm 3qy4746246 f38h382jlk hs6bdukanm mlmmfzh3r3 v4nxqhlyqp wzmmz9fp6w su67r6k2v3 yclnxrl5pm t38b2kh725 7ug5zh24hu gta9lk7p23 vutu7akeur y5ghdn5j9k v9wttpbfk9 n38lu8286q 47vhws6wlr kbd757ywx3 9t245vhmpl a2p9lx4jpn 22mmun2rn5 44jx6755aq k674qkevps 4468km3ulz 2u9pt9hc89 8s468mfl3y klf5c3l5u5 ppxm28t8ap kbmxgpxpgc uw77j35x4d 578prtvx9j 4dzt52r2t5 tl55sbb4fm c3frkrj4fj e5fvkxwrpn 8c4e2ghe7u 3rd42ekr43 97r2b46745 3qcr597p9d; do
  $PB -c "Add :SKAdNetworkItems:$i dict" "$PL"
  $PB -c "Add :SKAdNetworkItems:$i:SKAdNetworkIdentifier string $id.skadnetwork" "$PL"
  i=$((i+1))
done
echo "Fertig: $i SKAdNetwork-Einträge, App-ID und Tracking-Text sind in Info.plist."
echo "Jetzt noch in config.js die Anzeigenblock-ID eintragen und in Xcode mit Cmd+R starten."
