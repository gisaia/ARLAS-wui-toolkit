
#!/bin/bash
set -e

usage(){
	echo "Usage: ./release.sh -version='1.0.0' -ref_branch=develop --stage=beta|rc|stable"
	echo " -version     arlas-wui-toolkit version release,level of evolution"
  echo " -s|--stage    Stage of the release : beta | rc | stable. If --stage is 'rc' or 'beta', there is no merge of develop into master (if -ref_branch=develop)"
  echo " -i|--stage_iteration=n, the released version will be : [x].[y].[z]-beta.[n] OR  [x].[y].[z]-rc.[n] according to the given --stage"
	echo " -ref_branch | --reference_branch  from which branch to start the release."
  echo "    Add -ref_branch=develop for a new official release"
  echo "    Add -ref_branch=x.x.x for a maintenance release"
	exit 1
}


# ARGUMENTS $1 = VERSION  $2 = ref_branch $3 stage $4 stage iteration (for beta & rc)
releaseProd(){

    local VERSION=$1
    local BRANCH=$2
    local STAGE_LOCAL=$3
    local STAGE_ITERATION_LOCAL=$4

    if [ "${STAGE_LOCAL}" == "rc" ] || [ "${STAGE_LOCAL}" == "beta" ];
        then
        local VERSION="${VERSION}-${STAGE_LOCAL}.${STAGE_ITERATION_LOCAL}"
    fi

    echo "=> Get "$BRANCH" branch of ARLAS-wui-toolkit project"
    git fetch
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
    echo "=> Test to lint and build the project on "$BRANCH" branch"
    npm --no-git-tag-version version ${VERSION}
    npm --no-git-tag-version --prefix projects/arlas-toolkit version ${VERSION}

    echo "=> Build the ARLAS-wui-toolkit library"
    npm install
    npm run lint
    npm run build-release

    echo "=> Tag version $VERSION"
    git add .
    git config --local user.email "github-actions[bot]@users.noreply.github.com"
    git config --local user.name "github-actions[bot]"
    commit_message_release="Release prod version $VERSION"
    git tag -a v"$VERSION" -m "$commit_message_release"
    git push origin v"$VERSION"

    echo "=> Generate CHANGELOG"
    docker run --rm -v "$(pwd)":/usr/local/src/your-app gisaia/github-changelog-generator:latest github_changelog_generator \
      -u gisaia -p ARLAS-wui-toolkit --token ${GITHUB_CHANGELOG_TOKEN} --no-pr-wo-labels --no-issues-wo-labels --no-unreleased \
      --issue-line-labels conf,documentation,CI,ALL,DONUT,RESULTLIST,POWERBARS,HISTOGRAM,MAP \
      --exclude-labels type:duplicate,type:question,type:wontfix,type:invalid \
      --bug-labels type:bug --enhancement-labels type:enhancement --breaking-labels type:breaking \
      --enhancement-label "**New stuff:**" --issues-label "**Miscellaneous:**" \
      --exclude-tags v3.1.2 --since-tag v4.0.0

    echo "  -- Remove tag to add generated CHANGELOG"
    git tag -d v"$VERSION"
    git push origin :v"$VERSION"

    echo "  -- Commit release version"
    git commit -a -m "$commit_message_release" --allow-empty
    git tag v"$VERSION"
    git push origin v"$VERSION"
    git push origin "$BRANCH"

    cp README-NPM.md dist/arlas-wui-toolkit/README.md
    cp LICENSE.txt dist/arlas-wui-toolkit/LICENSE
    cd dist/arlas-wui-toolkit/

    echo "=> Publish to npm"
    if [ "${STAGE_LOCAL}" == "rc" ] || [ "${STAGE_LOCAL}" == "beta" ];
        then
        echo "  -- tagged as ${STAGE_LOCAL}"
        npm publish --tag=${STAGE_LOCAL}
    else
        npm publish
    fi
    cd ../..
    rm -rf dist
    if [ "$BRANCH" == "develop" ] && [ "$STAGE_LOCAL" == "stable" ];
        then
        echo "=> Merge develop into master"
        git checkout master
        git pull origin master
        git merge origin/develop
        git push origin master

        git checkout develop
        git pull origin develop
        git rebase origin/master
    fi
    IFS='.' read -ra TAB <<< "$VERSION"
    major=${TAB[0]}
    minor=${TAB[1]}
    newminor=$(( $minor + 1 ))
    newDevVersion=${major}.${newminor}.0
    npm --no-git-tag-version version ""$newDevVersion"-dev0"
    git add .
    commit_message="update package.json to"-"$newDevVersion"
    git commit -m "$commit_message" --allow-empty
    git push origin "$BRANCH"
    echo "Well done :)"

}

# ARGUMENTS $1 = VERSION  $2 = patch/minor/major $3 = PROJECT $4 ref_branch $5 is beta $6 stage_iteration
# ARGUMENTS $1 = VERSION  $2 = ref_branch $3 stage $4 stage iteration (for beta & rc)
release(){
    releaseProd $1 $2 $3 $4
}
STAGE="stable"
for i in "$@"
do
case $i in
    -version=*)
    RELEASE_VERSION="${i#*=}"
    shift # past argument=value
    ;;
    -ref_branch=*)
    REF_BRANCH="${i#*=}"
    shift # past argument=value
    ;;
    -s=*)
    STAGE="${i#*=}"
    shift # past argument=value
    ;;
    -i=*)
    STAGE_ITERATION="${i#*=}"
    shift # past argument=value
    ;;
    *)
            # unknown option
    ;;
esac
done

if [ -z ${REF_BRANCH+x} ];
    then
        echo ""
        echo "###########"
        echo "-ref_branch is missing."
        echo "  Add -ref_branch=develop for a new official release"
        echo "  Add -ref_branch=x.x.x for a maintenance release"
        echo "###########"
        echo ""
        usage;
fi

if [ -z ${STAGE+x} ];
    then
        echo ""
        echo "###########"
        echo "-s=*|--stage* is missing."
        echo "  Add --stage=beta|rc|stable to define the release stage"
        echo "###########"
        echo ""
        usage;
fi

if [ "${STAGE}" != "beta" ] && [ "${STAGE}" != "rc" ] && [ "${STAGE}" != "stable" ];
    then
        echo ""
        echo "###########"
        echo "Stage ${STAGE} is invalid."
        echo "  Add --stage=beta|rc|stable to define the release stage"
        echo "###########"
        echo ""
        usage;
fi

if [ "${STAGE}" == "beta" ] || [ "${STAGE}" == "rc" ];
    then
        if [ -z ${STAGE_ITERATION+x} ];
            then
                echo ""
                echo "###########"
                echo "You chose to release this version as ${STAGE}."
                echo "--stage_iteration is missing."
                echo "  Add -i=n|--stage_iteration=n, the released version will be : [x].[y].[z]-${STAGE}.[n]"
                echo "###########"
                echo ""
                usage;
        fi
fi

if [ ! -z ${RELEASE_VERSION+x} ];
    then
        echo "Release ARLAS-wui-toolkit version                    : ${RELEASE_VERSION}";
        release ${RELEASE_VERSION} ${REF_BRANCH} ${STAGE} ${STAGE_ITERATION}
fi
