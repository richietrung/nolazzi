module.exports = class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        let queryObj = { ...this.queryString };
        ['sort', 'fields', 'limit', 'page'].forEach(
            (field) => delete queryObj[field]
        );
        queryObj = JSON.parse(
            JSON.stringify(queryObj).replace(
                /\b(gt|gte|lt|lte)\b/g,
                (match) => `$${match}`
            )
        );
        this.query = this.query.find(queryObj);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortStr = this.queryString.sort
                .split(',')
                .join(' ');
            this.query = this.query.sort(sortStr);
        }
        return this;
    }

    fields() {
        if (this.queryString.fields) {
            const fieldsStr = this.queryString.fields
                .split(',')
                .join(' ');
            this.query = this.query.select(fieldsStr);
        }
        return this;
    }

    limit() {
        const limit = this.queryString.limit || 100;
        const page = this.queryString.page || 1;
        this.query = this.query
            .limit(limit)
            .skip((page - 1) * limit);
        return this;
    }
};
