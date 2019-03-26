async function getUserCollection(cli) {

    return uCollection = cli.db("wine_exchange").collection("user");
}

exports.getUserCollection = getUserCollection;