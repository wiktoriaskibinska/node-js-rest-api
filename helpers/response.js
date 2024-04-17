const sendResponse = (res, code, data) => {
  let status = null;
  if (code === 200 || code === 201) {
    status = "success";
  }
  res.json({ status, code: code, data });
};

module.exports = {
  sendResponse,
};
