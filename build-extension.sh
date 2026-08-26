#!/bin/bash

dpkg -s zip &> /dev/null
if [ $? -ne 0 ]
then
    if ! command -v zip &> /dev/null; then
        echo "Installing zip"
        sudo apt install zip
    fi
fi

dpkg -s jq &> /dev/null
if [ $? -ne 0 ]
then
    if ! command -v jq &> /dev/null; then
        echo "Installing jq"
        sudo apt install jq
    fi
fi

npm ci

./build.sh

rm -f singlefile-extension-chromium.zip singlefile-extension-edge.zip

# The Woleet API key is kept out of the repository and injected into the
# packaged files only, from the WOLEET_API_KEY variable or the .woleet-key file
WOLEET_API_KEY="${WOLEET_API_KEY:-$([ -f .woleet-key ] && cat .woleet-key)}"

package_extension() {
    rm -rf .staging
    mkdir .staging
    cp manifest.json .staging/
    cp -R lib _locales src .staging
    if [ -n "$WOLEET_API_KEY" ]; then
        sed -i.bak "s|WOLEET_API_KEY_PLACEHOLDER|$WOLEET_API_KEY|" .staging/src/lib/woleet/woleet.js .staging/lib/single-file-extension-background.js
        rm -f .staging/src/lib/woleet/woleet.js.bak .staging/lib/single-file-extension-background.js.bak
        if ! grep -q "$WOLEET_API_KEY" .staging/lib/single-file-extension-background.js; then
            echo "The Woleet API key could not be injected"
            exit 1
        fi
    fi
    (cd .staging && zip -r "../$1" manifest.json lib _locales src)
    rm -rf .staging
}

package_extension singlefile-extension-chromium.zip

cp src/core/bg/config.js config.copy.js
cp manifest.json manifest.copy.json
jq 'del(.oauth2)' manifest.json > manifest.tmp.json && mv manifest.tmp.json manifest.json
sed -i.bak 's/forceWebAuthFlow: false/forceWebAuthFlow: true/g' src/core/bg/config.js
sed -i.bak 's/image\/avif,//g' src/core/bg/config.js
rm -f src/core/bg/config.js.bak
# config.js is bundled into lib/ by rollup, so it must be rebuilt for the patches
# above to reach the code that actually runs
./build.sh
package_extension singlefile-extension-edge.zip
mv config.copy.js src/core/bg/config.js
mv manifest.copy.json manifest.json
# restore lib/ to the unpatched build kept in the repository
./build.sh
