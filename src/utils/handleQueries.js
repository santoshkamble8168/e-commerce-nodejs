class HandleQueries {
    constructor(query, queryString){
        this.query = query
        this.queryString = queryString
    }

    search(){
        const search = this.queryString.search ? {
            name: {
                $regex: this.queryString.search,
                $options: "i"
            }
        } : {}
        this.query = this.query.find({...search})
        return this

    }

    filter(){
        const queryClone = {...this.queryString}
        const removeFields = ["search", "page", "limit"]
        removeFields.forEach(key => delete queryClone[key])

        //filter price/rating
        let queryStr = JSON.stringify(queryClone)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)

        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryString.page) || 1
        const skipRecords = resultPerPage * (currentPage - 1)

        this.query = this.query.limit(resultPerPage).skip(skipRecords)
        return this

    }
}

module.exports = HandleQueries