module.exports = function unique(arr) {
  var obj = {};
  for (var i = 0; i < arr.length; i++) {
    obj[arr[i]] = true;
  }
  return Object.keys(obj);
};
