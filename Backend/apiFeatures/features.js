class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    let keywordFilter = {};

    if (this.queryStr && this.queryStr.keyword) {
      keywordFilter = {
        title: {
          $regex: this.queryStr.keyword,
          $options: "i",
        },
      };
    }

    // console.log(keywordFilter);

    this.query = this.query.find({ ...keywordFilter });
    return this;
  }

  pagination() {
    const currentPage =
      this.queryStr && this.queryStr.page ? Number(this.queryStr.page) : 1;
    let resultPerPage =
      this.queryStr && this.queryStr.resultPerPage
        ? Number(this.queryStr.resultPerPage)
        : 50;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}
module.exports = ApiFeatures;
