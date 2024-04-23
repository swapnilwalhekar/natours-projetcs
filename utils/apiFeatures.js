class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    // BUILD QUERY
    //  1) API Filtering
    filter() {
        // 1A) API filtering
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit'];
        excludedFields.forEach((el) => delete queryObj[el]);

        // 1B) Adavance API filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    // 2) Sorting
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' '); // when pass two arguments for sort
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    // 3) Fields limiting
    /*-------------- not working --------------*/
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('__v');
        }
        return this;
    }

    // 4) Pagination
    paginate() {
        const page = this.queryString.page * 1 || 1;
        const pageLimit = this.queryString.limit * 1 || 100;
        const entrySkip = (page - 1) * pageLimit;

        this.query = this.query.skip(entrySkip).limit(pageLimit);

        return this;
    }
}

module.exports =  APIFeatures ;
