async function getUserCollection(cli) {

    const uCollection = cli.db("wine_exchange").collection("post");
    return uCollection;
}

exports.getUserCollection = getUserCollection;