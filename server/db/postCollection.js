async function getPostCollection(cli) {

    const pCollection = cli.db("wine_exchange").collection("post");
    return pCollection;
}

exports.getPostCollection = getPostCollection;