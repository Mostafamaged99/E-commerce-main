export class ApiFeatures {
  constructor(mongooseQuery, searchQuery) {
    this.mongooseQuery = mongooseQuery;
    this.searchQuery = searchQuery;
  }
  pagination() {
    let pageNumber = this.searchQuery.page * 1 || 1;
    if (this.searchQuery.page < 1) {
      pageNumber = 1;
    }
    const limit = 10;
    let skip = (parseInt(pageNumber) - 1) * limit;
    this.pageNumber = pageNumber;
    this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
  filter() {
    let filterObj = structuredClone(this.searchQuery);
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(/(gt|gte|lt|lte|in)/g, (key) => `$${key}`);
    filterObj = JSON.parse(filterObj);
    let excludedFields = ["page", "sort", "search", "fields"];
    excludedFields.forEach((el) => delete filterObj[el]);
    this.mongooseQuery
      .find(filterObj)
    return this;
  }
  sort() {
    if (this.searchQuery.sort) {
      const sortBy = this.searchQuery.sort.split(",").join(" ");
      this.mongooseQuery.sort(sortBy);
    }
    return this;
  }
  fields() {
    if (this.searchQuery.fields) {
      const fields = this.searchQuery.fields.split(",").join(" ");
      this.mongooseQuery.select(fields);
    }
    return this;
  }
  search() {
    if (this.searchQuery.search) {
      this.mongooseQuery.find({
        $or: [
          { name: { $regex: this.searchQuery.search, $options: "i" } },
          { description: { $regex: this.searchQuery.search, $options: "i" } },
        ],
      });
    }
    return this;
  }
}
