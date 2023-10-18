const getExpenses = (req, where) => {
  return req.user.getExpenses(where);
};

const FileUrl = (req,where)=>{
    return req.user.FileUrl(where)
}
module.exports = {
  getExpenses,
  FileUrl
};


